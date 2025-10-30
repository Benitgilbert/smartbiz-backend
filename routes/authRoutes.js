const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");


router.post("/register", register);
router.post("/login", login);
router.post("/refresh", authController.refreshToken);
router.post("/admin/resend-otp", authController.resendAdminOTP);
// Admin login with 2FA (OTP)
router.post("/admin/login-step1", authController.adminLoginStep1); // Step 1: verify password, send OTP
router.post("/admin/login-step2", authController.adminLoginStep2); // Step 2: verify OTP, issue token
router.post("/admin/resend-otp", authController.resendAdminOTP);   // Optional: resend OTP



router.get("/admin/dashboard", authMiddleware(["admin"]), (req, res) => {
  res.json({ message: `Welcome, ${req.user.role} user` });
});

module.exports = router;