// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

// Route imports
import courseRoutes from "./routes/courseRoutes.js";
import contactRoutes from "./routes/contact.js";
import registrationRoutes from "./routes/registration.js";
import assignmentRoutes from "./routes/assignment.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/adminRoutes.js";
import zoomRoutes from "./routes/zoom.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import dashboardSettingsRoutes from "./routes/dashboardSettingsRoutes.js";


// Passport config
import "./config/passport.js";

dotenv.config();
const app = express();

// ESM __dirname replacement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===========================================================
//  Serve uploaded images statically
// ===========================================================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===========================================================
//  Body parser limits
// ===========================================================
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));


// ✅ FIX — cookieParser BEFORE routes
app.use(cookieParser());
// ===========================================================
//  CORS Configuration
// ===========================================================
// If using sessions (credentials), origin cannot be "*"
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ===========================================================
//  Sessions (required for passport)
// ===========================================================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set true if using HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ===========================================================
//  MongoDB Connection
// ===========================================================
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/mydb";
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.set("strictQuery", true);
    console.log(`✅ MongoDB connected: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};
connectDB();



// ===========================================================
//  Routes
// ===========================================================
app.use("/api/courses", courseRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/registration", registrationRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/zoom", zoomRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/user", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardSettingsRoutes);





// ===========================================================
//  Fallback 404 for unknown routes
// ===========================================================
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "❌ API route not found." });
});

// ===========================================================
//  Global Error Handler
// ===========================================================
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ===========================================================
//  Start server
// ===========================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
