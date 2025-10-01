const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const dotenv = require("dotenv");
dotenv.config();

// REGISTER

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, jwtSecret } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Fyll i alla fält" });
    }

    // Kontrollera om användaren redan finns
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Användare finns redan" });
    }

    // Hasha lösenord
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default user
    let isAdmin = false;

    // Om admin ska registreras
    if (role === "admin") {
      if (!jwtSecret || jwtSecret !== process.env.JWT_SECRET) {
        return res.status(401).json({ msg: "Ogiltig JWT Secret för admin!" });
      }
      isAdmin = true;
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin,
    });
    await newUser.save();

    res.json({ msg: "Registrering lyckades!" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Serverfel");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password, role, jwtSecret } = req.body;

  if (role === "admin") {
    if (!jwtSecret || jwtSecret !== process.env.JWT_SECRET)
      return res.status(401).json({ msg: "Fel JWT Secret!" });

    return res.json({ msg: "Admin inloggad" });
  }

  // Vanlig användare
  if (!email || !password)
    return res.status(400).json({ msg: "Fyll i alla fält" });

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ msg: "Ogiltiga inloggningsuppgifter" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ msg: "Ogiltiga inloggningsuppgifter" });

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  });
});

// GET CURRENT USER
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Serverfel");
  }
});

module.exports = router;
