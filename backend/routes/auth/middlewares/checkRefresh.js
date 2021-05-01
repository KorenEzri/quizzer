const jwt = require("jsonwebtoken");
const authController = require("../auth-controller");

const checkRefreshToken = (req, res, next) => {
  const token = req.body.token;
  if (!token)
    return res.status(401).json({ message: "Refresh token required" });
  jwt.verify(token, authController.refreshTokenSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    req.user = decoded;
    next();
  });
};
module.exports = { checkRefreshToken };
