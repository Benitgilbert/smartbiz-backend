const rateLimit = require("express-rate-limit");

const reportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 requests per window
  message: "Too many reports generated. Please wait and try again.",
});

const analyticsLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: "Too many analytics requests. Please slow down.",
});

module.exports = {
  reportLimiter,
  analyticsLimiter,
};