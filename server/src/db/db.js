const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to database");
  } catch (err) {
    console.log("Error connecting to database", err);
    process.exit(1);
  }
}

module.exports = connectDB ;