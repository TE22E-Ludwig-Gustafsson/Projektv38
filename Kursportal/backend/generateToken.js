const jwt = require("jsonwebtoken");

// Ersätt med ditt riktiga JWT_SECRET från .env-filen
const JWT_SECRET = "DIN_JWT_SECRET";

// Generera en giltig token
const token = jwt.sign(
  { id: "admin-id", isAdmin: true, class: "admin" },
  JWT_SECRET,
  { expiresIn: "12h" }
);

console.log("Generated Token:", token);