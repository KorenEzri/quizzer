const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelizeUtils = require("./sequelize-utils");

const UserResponses = {
  ALREADY_TAKEN: 1,
  SUCCESS: 2,
  ERROR: 3,
  USER_NOT_FOUND: 4,
  INCORRECT_INPUT: 5,
};

const createFormattedDatePlusDays = (days) => {
  const newDate = new Date();
  const numberOfDaysToAdd = days;
  newDate.setDate(newDate.getDate() + numberOfDaysToAdd);
  const dd = newDate.getDate();
  const mm = newDate.getMonth() + 1;
  const y = newDate.getFullYear();
  const formattedDate = dd + "/" + mm + "/" + y;
  return formattedDate;
};

const generateRefreshToken = async (username) => {
  const payload = {};
  const options = {
    expiresIn: "2d",
    audience: `${username}`,
    issuer: "KorenimBaam",
  };
  const refreshToken = {
    refreshToken: jwt.sign(payload, refreshTokenSecret, options),
    expires: new Date(`${createFormattedDatePlusDays()}`),
  };
  const refreshTokenCreationRes = await sequelizeUtils.createRefreshToken(
    refreshToken
  );
  if (refreshTokenCreationRes === "OK") {
    return refreshToken;
  } else if (refreshTokenCreationRes === "Token already taken!") {
    generateRefreshToken();
  } else if (refreshTokenCreationRes === "ERROR") {
    return "ERROR";
  }
};

const generateAccessToken = async (username) => {
  if (typeof username === "string") {
    const foundUser = sequelizeUtils.findOneUser(username);
    return jwt.sign({ user: foundUser }, tokenSecret, {
      expiresIn: "1h",
    });
  } else {
    return jwt.sign({ user: username }, tokenSecret, {
      expiresIn: "1h",
    });
  }
};
const tokenSecret = "VERYSEXYTOKENSECRETIHAVE";
const refreshTokenSecret = "VERYSEXYREFTOKENSECRETIHAVE";
const saltRounds = 10;

const createUser = async (user) => {
  let hashedPassword;
  try {
    await bcrypt.hash(user.password, saltRounds, async (err, hash) => {
      if (err) {
        console.error(err);
        return "ERROR!";
      } else {
        hashedPassword = hash;
        const newUser = {
          username: user.username,
          email: user.email,
          password: hashedPassword,
          firstName: user.firstName,
          lastName: user.lastName,
          nickname: user.nickname,
        };
        sequelizeUtils.createUser(newUser);
      }
    });
    return UserResponses.SUCCESS;
  } catch ({ message }) {
    console.log(
      "ERROR WITH createUser() at auth-controller.js at ~line 73",
      message
    );
    return UserResponses.ERROR;
  }
};
const loginUser = async (user) => {
  const isUser = sequelizeUtils.findOneUser(user.username);
  if (!isUser) return { res: UserResponses.USER_NOT_FOUND };
  const isValidated = await bcrypt.compare(user.password, isUser.password);
  if (isValidated) {
    user.password = "";
    const accessToken = await generateAccessToken(isUser);
    const refreshToken = await generateRefreshToken(isUser.name);
    return {
      res: UserResponses.SUCCESS,
      accessToken,
      nickName: isUser.nickName,
      email: isUser.email,
      refreshToken,
    };
  } else {
    return { res: UserResponses.INCORRECT_INPUT };
  }
};

module.exports = {
  createUser,
  loginUser,
  generateAccessToken,
  generateRefreshToken,
  tokenSecret,
  refreshTokenSecret,
};
