const Order = require("../models/Order");

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