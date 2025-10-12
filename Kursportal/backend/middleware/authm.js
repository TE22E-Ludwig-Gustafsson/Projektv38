const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Ta bort all token-verifiering
module.exports = (req, res, next) => {
  next();
};
