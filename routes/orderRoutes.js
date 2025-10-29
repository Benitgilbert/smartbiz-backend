const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

// Customer places an order
router.post("/", authMiddleware(["customer"]), orderController.placeOrder);

// Admin views all orders
router.get("/", authMiddleware(["admin"]), orderController.getAllOrders);

// Admin updates order status
router.put("/:id/status", authMiddleware(["admin"]), orderController.updateOrderStatus);

// Admin filtered view
router.get("/filter", authMiddleware(["admin"]), orderController.getFilteredOrders);


module.exports = router;