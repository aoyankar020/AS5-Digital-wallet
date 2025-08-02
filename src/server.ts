import { Server } from "http";
import mongoose from "mongoose";
import { app } from "./app";
import { ENV } from "./app/config/env.config";
import { seedAdmin } from "./app/utils/superAdmin";
let server: Server;
// ✅  Monitor Mongoose event listeners **before** connecting
mongoose.connection
  .on("connecting", () => console.log("🔄 Connecting to MongoDB..."))
  .on("connected", () => console.log("✅ Connected to MongoDB"))
  .on("open", () => console.log("🔓 Connection is open"))
  .on("disconnecting", () => console.log("🚪 Disconnecting from MongoDB..."))
  .on("disconnected", () => console.log("❌ Disconnected from MongoDB"))
  .on("close", () => console.log("🔒 Connection closed"))
  .on("reconnected", () => console.log("🔁 Reconnected to MongoDB"))
  .on("error", (err) => console.error("❗ Connection error:", err))
  .on("fullsetup", () => console.log("📡 All replica set members connected"))
  .on("reconnectFailed", () => console.warn("⚠️ Reconnection failed"));

const loadServer = async () => {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log("🌿 Mongoose connected successfully");

    // Start Express server
    server = app.listen(ENV.SERVER_PORT, () => {
      console.log(
        `🚀 Server is running on port ${ENV.SERVER_PORT} & URL: http://localhost:${ENV.SERVER_PORT}/`
      );
    });
  } catch (err) {
    console.error("❌ Failed to connect MongoDB or start server:", err);
    process.exit(1);
  }
};
// Graceful shutdown
const handleExit = (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Shutting down...`);

  if (server) {
    server.close(() => {
      console.log("🛑 HTTP server closed.");
      mongoose.connection.close(false);
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

//  Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
  handleExit("unhandledRejection");
});
// Handle uncaughtException
process.on("uncaughtException", (reason) => {
  console.error("❌ uncaughtException:", reason);
  handleExit("uncaughtException");
});
// Handle termination signals
process.on("SIGINT", () => handleExit("SIGINT"));
process.on("SIGTERM", () => handleExit("SIGTERM"));

(async () => {
  await loadServer();
  await seedAdmin();
})();
