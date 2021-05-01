const jwt = require("jsonwebtoken");
const authController = require("../auth-controller");

const checkUserStatusByToken = (req, res) => {
  let token = req.headers.authorization;
  if (!token || Array.isArray(token)) return "Access token required";
  token = token.split(" ")[1];
  jwt.verify(token, authController.tokenSecret, (err, decoded) => {
    if (err) {
      return "Invalid access token";
    }
    return (req.user = decoded);
  });
};
module.exports = { checkUserStatusByToken };
