import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";  // your auth route file
import fileRoutes from "./routes/fileRoutes.js";  // your file routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({ origin: "http://localhost:3000" })); // allow frontend
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes); // <--- must match frontend
app.use("/api/files", fileRoutes); 

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
