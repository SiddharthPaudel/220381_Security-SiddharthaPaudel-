import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";

// Routes
import authRoutes from "./routes/authRoutes.js";
import mangaRoutes from "./routes/mangaRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// Config
import connectDB from "./config/db.js";
import { globalApiLimiter } from './middleware/rateLimiter.js';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
// Load environment variables
dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// ✅ Security Middlewares
app.use(express.json());

// app.use(cookieParser());
// 🔒 Helmet with custom configuration
app.use(
  helmet({
    contentSecurityPolicy: false, // Avoid CSP blocking your images for now
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow loading images / fonts
  })
);
app.use(helmet.frameguard({ action: "deny" })); // Clickjacking prevention
app.use(helmet.noSniff()); // Prevent MIME sniffing
app.use(helmet.xssFilter()); // Basic XSS protection
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true })); // Enforce HTTPS for 1 year
// app.use(mongoSanitize({
//     onSanitize: ({ req, key }) => {
//         console.warn(`This request had its ${key} sanitized`);
//     },
//     replaceWith: '_',
//     allowDots: true
// }));
// // Resolve __dirname in ES module

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Connect to MongoDB
connectDB();

// ✅ Serve Static Files (Uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes
app.use("/api/auth", mongoSanitize(),globalApiLimiter, authRoutes);
app.use("/api/payment",mongoSanitize(),globalApiLimiter, paymentRoutes);
app.use("/api/manga",mongoSanitize(),globalApiLimiter, mangaRoutes);



// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

