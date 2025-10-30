const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const { reportLimiter, analyticsLimiter } = require("../middleware/rateLimiter");

// Customer places an order
router.post("/", authMiddleware(["customer"]), orderController.placeOrder);

// Admin views all orders
router.get("/", authMiddleware(["admin"]), orderController.getAllOrders);

// Admin updates order status
router.put("/:id/status", authMiddleware(["admin"]), orderController.updateOrderStatus);

// Admin filtered view
router.get("/filter", authMiddleware(["admin"]), orderController.getFilteredOrders);

//analytics

router.get("/report", authMiddleware(["admin"]), reportLimiter, orderController.generateReport);
router.get("/report/logs", authMiddleware(["admin"]), reportLimiter, orderController.getReportLogs);
router.get("/analytics", authMiddleware(["admin"]), analyticsLimiter, orderController.getOrderAnalytics);

router.post("/report/logs/:id/view", authMiddleware(["admin"]), orderController.markReportViewed);
router.post("/report/logs/:id/download", authMiddleware(["admin"]), orderController.markReportDownloaded);
module.exports = router;