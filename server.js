const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
require("./jobs/scheduledReports");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

   
   //connect routes to server
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const customizationRoutes = require("./routes/customizationRoutes");
const orderRoutes = require("./routes/orderRoutes");


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customizations", customizationRoutes);
app.use("/api/orders", orderRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("SmartBiz backend is running!");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
  app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port 5000");
  });
})
.catch((err) => console.error("MongoDB connection error:", err));