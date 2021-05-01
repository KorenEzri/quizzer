const jwt = require("jsonwebtoken");
const authController = require("../auth-controller");

const checkToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token || Array.isArray(token))
    return res.status(401).json({ message: "Access token required" });
  token = token.split(" ")[1];
  jwt.verify(token, authController.tokenSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid access token" });
    }
    req.user = decoded;
    next();
  });
};
module.exports = { checkToken };
