const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "cashier", "inventory", "delivery", "customer", "guest"],
    default: "customer",
  },
 signatureImage: {
  type: String, // URL or file path to uploaded signature
  default: null,
},
stampImage: {
  type: String, // URL or file path to uploaded stamp
  default: null,
},
title: {
  type: String, // e.g. "SmartBiz Administrator"
  trim: true,
},

  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  otp: { type: String },
otpExpires: { type: Date },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  refreshToken: { type: String },
});

module.exports = mongoose.model("User", userSchema);