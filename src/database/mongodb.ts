import mongoose from "mongoose";
import { NODE_ENV, DB_URI } from "../config/env";

if(!DB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.<development/production>.local');
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI!);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to detabase:", error);
    process.exit(1);
  }
}

export default connectToDatabase;