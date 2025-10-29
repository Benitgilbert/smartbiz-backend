const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);



router.get("/admin/dashboard", authMiddleware(["admin"]), (req, res) => {
  res.json({ message: `Welcome, ${req.user.role} user` });
});

module.exports = router;