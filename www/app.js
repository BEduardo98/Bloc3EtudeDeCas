const { server } = require("../server");
const config = require("../config");
const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("Database connected");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

connectToDatabase();

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.on("open", () => {
  console.log("Database connection established");
});

server.listen(config.port, () => {
  console.log("Server is running on port", config.port);
});

// Gérer correctement la terminaison du processus
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    process.exit(1);
  }
});
