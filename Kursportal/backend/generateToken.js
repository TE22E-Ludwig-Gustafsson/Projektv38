const jwt = require("jsonwebtoken");

const JWT_SECRET = "abc";

// Generera en giltig token
const token = jwt.sign(
  { id: "admin-id", isAdmin: true, class: "admin" },
  JWT_SECRET,
  { expiresIn: "12h" }
);

console.log("Generated Token:", token);