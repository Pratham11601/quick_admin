const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const swaggerDocs = require("./swagger/swaggerConfig");

// Load environment variables
dotenv.config();

const app = express();

// 🔹 Middleware Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*", // Restrict origin via .env (Default: Allow all)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for APIs (adjust if needed)
  })
);
app.use(morgan("combined")); // HTTP request logging
app.use(compression()); // Response compression
app.use(express.json()); // Parse JSON bodies (replacing body-parser)
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// 🔹 Import and Register Routes
const adminRoutes = require("./routes/adminRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cityRoutes = require("./routes/cityRoutes");
const subPackageRoutes = require("./routes/subPackageRoutes");
const helpSupportRoutes = require("./routes/helpSupportRoutes");
const leadRoutes = require("./routes/leadsRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes"); // Add subscription routes

app.use("/api/admin", adminRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/sub-packages", subPackageRoutes);
app.use("/api/help-support", helpSupportRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/subscriptions", subscriptionRoutes); // Match the route prefix

// 🔹 Swagger API Documentation
swaggerDocs(app);

// 🔹 Default API Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Welcome to the API! Check documentation at /api-docs",
  });
});

// 🔹 404 Handler for Unknown Routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "❌ Route not found. Check API documentation at /api-docs",
  });
});

// 🔹 Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// 🔹 Graceful Shutdown Handling
const shutdownHandler = (signal) => {
  console.log(`🛑 Received ${signal}, shutting down gracefully...`);
  process.exit(0);
};

process.on("SIGINT", () => shutdownHandler("SIGINT"));
process.on("SIGTERM", () => shutdownHandler("SIGTERM"));

module.exports = app;
