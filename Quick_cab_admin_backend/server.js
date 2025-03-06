require("dotenv").config(); // Load environment variables
const app = require("./app");

const PORT = process.env.PORT || 5000;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
  console.log(`📄 Swagger Docs available at: http://localhost:${PORT}/api-docs`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("🚨 Unhandled Promise Rejection:", err.message);
  console.error(err.stack); // Log stack trace for debugging
  server.close(() => process.exit(1)); // Gracefully shut down
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err.message);
  console.error(err.stack);
  process.exit(1);
});

// Gracefully handle termination signals (e.g., Ctrl+C, Docker Stop)
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("✅ Process terminated.");
    process.exit(0);
  });
});
