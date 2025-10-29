const mongoose = require("mongoose");

const customizationSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  customText: String,
  customFile: String, // image or PDF filename
  cloudLink: String,
  cloudPassword: String,
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Customization", customizationSchema);