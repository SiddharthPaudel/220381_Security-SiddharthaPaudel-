import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Comic");
    
    console.log("MongoDB connected");
  } catch (e) {
    console.log("MongoDB connection error:", e);
  }
};

export default connectDB;
