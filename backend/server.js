const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/capstone-project",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Cart Item Schema
const cartItemSchema = new mongoose.Schema({
  productId: Number,
  quantity: Number,
  productPrice: Number,
  productName: String,
  productShortName: String,
  addedDate: String,
  productImageUrl: String,
  categoryName: String,
});

// Order Schema
const orderSchema = new mongoose.Schema({
  orderId: {
    type: Number,
    default: () => Math.floor(Math.random() * 1000000),
  },
  custId: { type: Number, required: true },
  totalInvoiceAmount: { type: Number, required: true },
  orderDate: { type: String, default: () => new Date().toISOString() },
  cartItems: [cartItemSchema],
});

const Order = mongoose.model("Order", orderSchema);

// Place Order Route
app.post("/api/BigBasket/PlaceOrder", async (req, res) => {
  try {
    const { CustId, TotalInvoiceAmount, OrderItems } = req.body;

    if (!CustId || !TotalInvoiceAmount || !OrderItems || !OrderItems.length) {
      return res.status(400).json({
        result: false,
        message: "Missing required order data.",
      });
    }

    // Create a new order
    const order = new Order({
      custId: CustId,
      totalInvoiceAmount: TotalInvoiceAmount,
      cartItems: OrderItems.map((item) => ({
        productId: item.ProductId,
        quantity: item.Quantity,
        productPrice: item.Price,
      })),
    });

    const savedOrder = await order.save();

    res.status(201).json({
      result: true,
      message: "Order placed successfully",
      data: savedOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      result: false,
      message: "Failed to place order. Please try again.",
    });
  }
});

// Get Orders Route
app.get("/api/BigBasket/GetOrders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json({
      result: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({
      result: false,
      message: "Failed to retrieve orders.",
    });
  }
});

// Delete Product from Cart Route
app.delete("/api/BigBasket/DeleteProductFromCartById/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Order.updateMany(
      {},
      { $pull: { cartItems: { productId: parseInt(id) } } }
    );
    res.json({ result: true, message: "Product deleted from cart" });
  } catch (error) {
    console.error("Error deleting product from cart:", error);
    res.status(500).json({
      result: false,
      message: "Failed to delete product from cart.",
    });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
