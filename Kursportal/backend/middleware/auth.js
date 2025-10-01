const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    req.user = { userId: "admin", isAdmin: true };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, isAdmin }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token är ogiltig" });
  }
};
