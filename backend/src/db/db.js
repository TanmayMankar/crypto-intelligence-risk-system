const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    // console.log("MONGO_URI:", uri); // Log the MONGO_URI for debugging
    if (!uri) throw new Error("MONGO_URI is not defined in environment");
    await mongoose.connect(uri)
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
