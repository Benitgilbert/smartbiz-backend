const cron = require("node-cron");
const path = require("path");
const User = require("../models/User");
const ReportLog = require("../models/ReportLog");
const { buildReportData } = require("../services/reportBuilders");
const generateReportPDF = require("../utils/reportGenerator");
const generateAISummary = require("../utils/aiSummary");
const fs = require("fs");

cron.schedule("0 8 1 * *", async () => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const admin = await User.findOne({ role: "admin" });
    if (!admin) return console.warn("No admin found for scheduled report");

    const { orders, summary } = await buildReportData("monthly", { month, year });
    const aiSummary = generateAISummary("monthly", summary);

    await ReportLog.create({
      type: "monthly",
      filters: { month, year },
      generatedBy: admin._id,
      format: "pdf",
      aiSummary,
    });

    const logoPath = path.join(__dirname, "../assets/logo.png");
    const filePath = path.join(__dirname, `../reports/monthly-${month}-${year}.pdf`);

    const doc = generateReportPDF(orders, summary, logoPath, {
      name: admin.name,
      title: admin.title || "SmartBiz Administrator",
      signatureImage: admin.signatureImage,
      stampImage: admin.stampImage,
    }, `Monthly Report - ${month}/${year}`);
    
   const sendReportEmail = require("../utils/emailSender");

await sendReportEmail({
  to: admin.email,
  subject: `📊 Monthly Report - ${month}/${year}`,
  text: `Your monthly report is ready.\n\nSummary:\n${aiSummary}`,
  attachmentPath: filePath,
});
    doc.pipe(fs.createWriteStream(filePath));
    doc.end();

    console.log(`✅ Monthly report generated: ${filePath}`);
  } catch (err) {
    console.error("❌ Scheduled report generation failed:", err);
  }
});