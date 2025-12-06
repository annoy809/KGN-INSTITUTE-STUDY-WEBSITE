// db.js
// This file establishes the connection to the MongoDB database using Mongoose.

const mongoose = require("mongoose");

// This function connects to the MongoDB database.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // The options below are recommended best practices for Mongoose v6+ and are now default,
      // but it's good practice to keep them for older versions or to be explicit.
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Exit process with failure code
    process.exit(1);
  }
};

module.exports = connectDB;



