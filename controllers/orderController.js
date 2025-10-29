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
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};