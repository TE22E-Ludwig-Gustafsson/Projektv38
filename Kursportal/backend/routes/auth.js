const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/authm");
const dotenv = require("dotenv");
const classMap = {
  "klass-a": "1A",
  "klass-b": "1B",
  "klass-c": "1C",
};
dotenv.config();

// REGISTER

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, jwtSecret, userClass } = req.body;

    if (!name || !email || !password || (role === "user" && !userClass)) {
      return res.status(400).json({ msg: "Fyll i alla fält inklusive klass." });
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
      class: role === 'admin' ? 'admin' : userClass,
    });
    console.log({ name, email, role, userClass, jwtSecret });

    await newUser.save();

    res.json({ msg: "Registrering lyckades!" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Serverfel");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password, role, jwtSecret, userClass } = req.body;

  // Add log to verify role and isAdmin during login
  console.log("Role during login:", role);

  if (role === "admin") {
    console.log("Admin login detected");
    if (!jwtSecret || jwtSecret !== process.env.JWT_SECRET)
      return res.status(401).json({ msg: "Fel JWT Secret!" });

    const adminUser = await User.findOne({ email, isAdmin: true });
    if (!adminUser)
      return res.status(401).json({ msg: "Admin-kontot finns inte" });

    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) return res.status(401).json({ msg: "Fel lösenord" });

    const adminToken = jwt.sign(
      { id: "admin-id", isAdmin: true, class: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.json({
      token: adminToken,
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        isAdmin: true,
        class: "admin",
      },
    });
  }

  // Vanlig användare
  if (!email || !password || !userClass)
    return res.status(400).json({ msg: "Fyll i alla fält, inklusive klass" });

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ msg: "Ogiltiga inloggningsuppgifter" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res.status(400).json({ msg: "Ogiltiga inloggningsuppgifter" });

  if (classMap[user.class] !== userClass) {
    return res.status(403).json({
      msg: `Du är registrerad i ${
        classMap[user.class]
      }. Du kan inte logga in i ${userClass}.`,
    });
  }

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin, class: user.class },
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
      class: user.class,
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
