const mongoose = require("mongoose");

const reportLogSchema = new mongoose.Schema({
  
  type: String,
  filters: Object,
  format: { type: String, default: "pdf" },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  viewedAt: [Date],
  downloadedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  downloadedAt: [Date],
  timestamp: { type: Date, default: Date.now },
  aiSummary: { type: String, default: "" },
});

module.exports = mongoose.model("ReportLog", reportLogSchema);