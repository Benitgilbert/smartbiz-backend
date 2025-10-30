const path = require("path");
const User = require("../models/User");
const { buildReportData } = require("../services/reportBuilders");
const generateReportPDF = require("../utils/reportGenerator");
const convertToCSV = require("../utils/csvExporter"); // You’ll create this next
const ReportLog = require("../models/ReportLog"); // Optional logging
const convertLogsToCSV = require("../utils/logCsvExporter");
const generateAISummary = require("../utils/aiSummary");

// Place an order (customer only)
exports.placeOrder = async (req, res) => {
  try {
    const order = new Order({
      product: req.body.product,
      customer: req.user.id,
      quantity: req.body.quantity || 1,
      customText: req.body.customText || null,
      customFile: req.body.customFile || null,
      cloudLink: req.body.cloudLink || null,
      cloudPassword: req.body.cloudPassword || null,
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("product customer");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const allowedStatuses = [
      "pending",
      "approved",
      "in-production",
      "ready",
      "delivered",
      "cancelled",
    ];

    const newStatus = req.body.status;

    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: newStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Filtered order view (admin only)
exports.getFilteredOrders = async (req, res) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.customer) query.customer = req.query.customer;
    if (req.query.product) query.product = req.query.product;

    const orders = await Order.find(query)
      .populate("product", "name price")
      .populate("customer", "name email");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//analytics

exports.getOrderAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const statusCounts = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const productCounts = await Order.aggregate([
      { $group: { _id: "$product", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          productName: "$product.name",
          count: 1
        }
      }
    ]);

    const customizationStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          usedCustomText: {
            $sum: { $cond: [{ $ifNull: ["$customText", false] }, 1, 0] }
          },
          usedCustomFile: {
            $sum: { $cond: [{ $ifNull: ["$customFile", false] }, 1, 0] }
          },
          usedCloudLink: {
            $sum: { $cond: [{ $ifNull: ["$cloudLink", false] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      totalOrders,
      statusCounts,
      productCounts,
      customizationStats: customizationStats[0]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.generateReport = async (req, res) => {
  try {
    const { type, format = "pdf", ...filters } = req.query;

    if (!type) {
      return res.status(400).json({ message: "Report type is required." });
    }

    const admin = await User.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin profile not found." });
    }

    const { orders, summary } = await buildReportData(type, filters);
    const aiSummary = generateAISummary(type, summary);

    // ✅ Log once
    await ReportLog.create({
      type,
      filters,
      generatedBy: admin._id,
      format,
      aiSummary,
    });
    await sendReportEmail({
  to: admin.email,
  subject: `📊 ${type.charAt(0).toUpperCase() + type.slice(1)} Report Ready`,
  text: `Your report has been generated.\n\nSummary:\n${aiSummary}`,
});

    // ✅ CSV Export
    if (format === "csv") {
      const csv = convertToCSV(orders);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=${type}-report.csv`);
      return res.send(csv);
    }

    // ✅ PDF Export
    const logoPath = path.join(__dirname, "../assets/logo.png");
    const doc = generateReportPDF(orders, summary, logoPath, {
      name: admin.name,
      title: admin.title || "SmartBiz Administrator",
      signatureImage: admin.signatureImage,
      stampImage: admin.stampImage,
    }, `${type.charAt(0).toUpperCase() + type.slice(1)} Report`);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=${type}-report.pdf`);
    doc.pipe(res);
    doc.end();
  } catch (err) {
    console.error(`${req.query.type} report generation failed:`, err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate report." });
    }
  }
};

exports.getReportLogs = async (req, res) => {
  try {
    const {
      type,
      format,
      user,
      from,
      to,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};
    if (type) query.type = type;
    if (format && format !== "csv") query.format = format;
    if (user) query.generatedBy = user;
    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    // ✅ CSV Export first
    if (format === "csv") {
      const logs = await ReportLog.find(query)
        .populate("generatedBy", "name email")
        .sort({ timestamp: -1 });

      const csv = convertLogsToCSV(logs);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=report-logs.csv");
      return res.send(csv);
    }

    // ✅ JSON response
    const logs = await ReportLog.find(query)
      .populate("generatedBy", "name email")
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ReportLog.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      logs,
    });
  } catch (err) {
    console.error("Failed to fetch report logs:", err);
    res.status(500).json({ message: "Failed to retrieve report logs." });
  }
};

exports.markReportViewed = async (req, res) => {
  try {
    const logId = req.params.id;
    const userId = req.user.id;

    await ReportLog.findByIdAndUpdate(logId, {
      $push: {
        viewedBy: userId,
        viewedAt: new Date(),
      },
    });

    res.json({ message: "Report marked as viewed." });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark report as viewed." });
  }
};

exports.markReportDownloaded = async (req, res) => {
  try {
    const logId = req.params.id;
    const userId = req.user.id;

    await ReportLog.findByIdAndUpdate(logId, {
      $push: {
        downloadedBy: userId,
        downloadedAt: new Date(),
      },
    });

    res.json({ message: "Report marked as downloaded." });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark report as downloaded." });
  }
};