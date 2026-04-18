const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUrl = process.env.MONGODB_URL;

  if (!mongoUrl) {
    throw new Error("MONGODB_URL is not defined in environment variables");
  }

  await mongoose.connect(mongoUrl);
  console.log("MongoDB connected successfully");
};

module.exports = connectDB;
