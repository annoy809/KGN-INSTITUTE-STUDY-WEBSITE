import mongoose from "mongoose";
import Category from "./models/Category.js";
import dotenv from "dotenv";


dotenv.config();

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mydb";

const seed = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });

    console.log("✅ Connected to:", mongoose.connection.name);

const data = [
  { icon: "fa-code", title: "Development", count: 7 },
  { icon: "fa-chart-line", title: "Business", count: 12 },
  { icon: "fa-network-wired", title: "IT & Software", count: 7 },
  { icon: "fa-users", title: "Productivity", count: 8 },
  { icon: "fa-pencil-ruler", title: "Design", count: 7 },
  { icon: "fa-search-dollar", title: "Digital Marketing", count: 15 },
  { icon: "fa-brain", title: "AI & Machine Learning", count: 10 },
  { icon: "fa-mobile-alt", title: "App Development", count: 6 },
  { icon: "fa-cloud", title: "Cloud Computing", count: 8 },
  { icon: "fa-shield-alt", title: "Cybersecurity", count: 9 },
  { icon: "fa-coins", title: "Crypto & Web3", count: 5 },
  { icon: "fa-language", title: "Language Learning", count: 11 },
];

    await Category.deleteMany(); // Optional: Clear old data
    await Category.insertMany(data);

    console.log("🎉 Category Data Inserted Successfully!");

    await mongoose.connection.close();
    console.log("🔌 Connection Closed");
  } catch (err) {
    console.error("❌ ERROR:", err);
  }
};

seed();
