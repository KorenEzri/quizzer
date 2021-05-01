const { Router } = require("express");
const { checkToken } = require("./middlewares/checkToken");
const { checkRefreshToken } = require("./middlewares/checkRefresh");
const jwt = "jsonwebtoken";
const authController = require("./auth-controller");
const authentication = Router();

authentication.post("/register", async (req, res) => {
  const newUser = req.body;
  const creationRes = await authController.createUser(newUser);
  if (creationRes === 1) {
    res.status(409).json({ message: "user already taken" });
  } else if (creationRes === 2) {
    res.status(201).send("Register Success");
  } else if (creationRes === 3) {
    res
      .status(500)
      .json({ message: "there was a problem processing your request." });
  }
});
authentication.post("/login", async (req, res) => {
  const { username, password, rememberToken } = req.body;
  const requestingUser = {
    username,
    password,
    name: "",
  };
  const loginRes = await authController.loginUser(requestingUser);
  if (loginRes.res === 2) {
    console.log(loginRes);
    const responseBody = {
      accessToken: loginRes.accessToken,
      refreshToken: loginRes.refreshToken.refreshToken,
      email: loginRes.email,
      nickname: loginRes.nickname,
      username: loginRes.username,
    };
    console.log(responseBody);
    res.status(200).send(responseBody);
  } else if (loginRes.res === 4) {
    res.status(404).json({ message: "cannot find user" });
  } else if (loginRes.res === 5) {
    res.status(403).json({ message: "User or Password incorrect" });
  }
});
authentication.post("/token", checkRefreshToken, async (req, res) => {
  if (req.user) {
    const aud = Object.values(req.user)[2];
    const accessToken = await authController.generateAccessToken(aud);
    const refreshToken = await authController.generateRefreshToken(aud);
    res.status(200).send({ accessToken, refreshToken });
  }
});
authentication.post("/logout", (req, res) => {
  const { token } = req.body;
  if (!token) {
    res.status(400).send("Refresh Token Required");
  } else {
    jwt.verify(token, authController.refreshTokenSecret, (err, decoded) => {
      if (err) {
        res.status(400).send("Invalid Refresh Token");
      }
      res.status(200).send("User Logged Out Successfully");
    });
  }
});
authentication.post("/tokenValidate", checkToken, (req, res) => {
  if (req.user) {
    res.status(200).json({ valid: true });
  }
});

module.exports = authentication;
