import mongoose from "mongoose";
// import { PrismaClient } from "src/generated/prisma";

import { NODE_ENV, DB_URI } from "../config/env";

// const prisma = new PrismaClient();


const connectToDatabase = async () => {
  if(!DB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.<development/production>.local');
}

  try {
    await mongoose.connect(DB_URI!);
    // await prisma.$connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
}

export default connectToDatabase;
