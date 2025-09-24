const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const dotenv = require("dotenv");
dotenv.config();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ msg: "Fyll i alla fält" });
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ msg: "Användare finns redan" });
    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "12h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: { id: user.id, name: user.name, email: user.email },
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Serverfel");
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "Fyll i alla fält" });
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Ogiltiga inloggningsuppgifter" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Ogiltiga inloggningsuppgifter" });
// ...existing code...
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "Fyll i alla fält" });
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Ogiltiga inloggningsuppgifter" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Ogiltiga inloggningsuppgifter" });

    // Skapa JWT-token med admin-status
    const payload = { userId: user.id, isAdmin: user.isAdmin };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "12h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin },
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Serverfel");
  }
});
// ...existing code...

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Serverfel");
  }
});

module.exports = router;
