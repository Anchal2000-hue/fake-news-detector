import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not set in environment variables");
    }
    await mongoose.connect(uri);
    console.log("[db] MongoDB connected");
  } catch (err) {
    console.error("[db] MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
