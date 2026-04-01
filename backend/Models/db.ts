import mongoose from "mongoose";
import "dotenv/config";

async function main(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGOSTR as string);
    console.log("Connected to Mongo db");
  } catch (err) {
    console.error("Mongo connection error:", err);
  }
}

main();
