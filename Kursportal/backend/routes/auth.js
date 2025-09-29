const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const dotenv = require("dotenv");
dotenv.config();

// Register
router.post("/login", async (req, res) => {
  try {
    const { email, password, role, jwtSecret } = req.body;
    if (!email || !password || !role)
      return res.status(400).json({ msg: "Fyll i alla fält" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Ogiltiga inloggningsuppgifter" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Ogiltiga inloggningsuppgifter" });

    // Kontrollera admin
    let isAdmin = false;
    if (role === "admin") {
      if (jwtSecret !== process.env.JWT_SECRET)
        return res.status(401).json({ msg: "Fel JWT Secret för admin!" });
      if (!user.isAdmin)
        return res.status(403).json({ msg: "Du är inte admin!" });
      isAdmin = true;
    }

    // Skapa JWT-token med admin-status
    const payload = { userId: user.id, isAdmin };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "12h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: { id: user.id, name: user.name, email: user.email, isAdmin },
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Serverfel");
  }
});


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
