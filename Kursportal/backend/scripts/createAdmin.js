const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

console.log("MONGO_URI:", process.env.MONGO_URI); // Felsökning

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "admin";
  const password = "apple";
  const name = "Admin"; 
  const hashedPassword = await bcrypt.hash(password, 10);

  const adminUser = new User({
    name,
    email,
    password: hashedPassword,
    isAdmin: true,
  });

  await adminUser.save();
  console.log("Admin-användare skapad!");
  mongoose.disconnect();
}

createAdmin();
