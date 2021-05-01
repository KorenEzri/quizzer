const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserResponses = {
  ALREADY_TAKEN: 1,
  SUCCESS: 2,
  ERROR: 3,
  USER_NOT_FOUND: 4,
  INCORRECT_INPUT: 5,
};

const generateRefreshToken = async (username) => {
  const payload = {};
  const options = {
    expiresIn: "2d",
    audience: `${username}`,
    issuer: "KorenimBaam",
  };
  const refreshToken = jwt.sign(payload, refreshTokenSecret, options);
  if (!REFRESHTOKENS.some((token) => token === refreshToken)) {
    REFRESHTOKENS.push(refreshToken);
  }
  return refreshToken;
};
const generateAccessToken = async (user) => {
  if (typeof user === "string") {
    const foundUser = USERS.find(
      (registeredUser) => registeredUser.name === user
    );
    return jwt.sign({ user: foundUser }, tokenSecret, {
      expiresIn: "10s",
    });
  } else {
    return jwt.sign({ user: user }, tokenSecret, {
      expiresIn: "10s",
    });
  }
};
const tokenSecret = "VERYSEXYTOKENSECRETIHAVE";
const refreshTokenSecret = "VERYSEXYREFTOKENSECRETIHAVE";
const saltRounds = 10;
const USERS = [];
const INFORMATION = [];
const REFRESHTOKENS = [];
const OPTIONS = [
  {
    register: {
      method: "post",
      path: "/users/register",
      description: "Register, Required: email, name, password",
      example: {
        body: { email: "user@email.com", name: "user", password: "password" },
      },
    },
  },
  {
    login: {
      method: "post",
      path: "/users/login",
      description: "Login, Required: valid email and password",
      example: { body: { email: "user@email.com", password: "password" } },
    },
  },
  {
    renewToken: {
      method: "post",
      path: "/users/token",
      description: "Renew access token, Required: valid refresh token",
      example: { headers: { token: "*Refresh Token*" } },
    },
  },
  {
    validateToken: {
      method: "post",
      path: "/users/tokenValidate",
      description: "Access Token Validation, Required: valid access token",
      example: { headers: { Authorization: "Bearer *Access Token*" } },
    },
  },
  {
    userInfo: {
      method: "get",
      path: "/api/v1/information",
      description: "Access user's information, Required: valid access token",
      example: { headers: { Authorization: "Bearer *Access Token*" } },
    },
  },
  {
    logout: {
      method: "post",
      path: "/users/logout",
      description: "Logout, Required: access token",
      example: { body: { token: "*Refresh Token*" } },
    },
  },
  {
    allUsers: {
      method: "get",
      path: "api/v1/users",
      description: "Get users DB, Required: Valid access token of admin user",
      example: { headers: { authorization: "Bearer *Access Token*" } },
    },
  },
];
const adminPass = "Rc123456!";
const adminUser = {
  email: "admin@email.com",
  name: "admin",
  password: adminPass,
  isAdmin: true,
};

const createUser = async (user) => {
  if (
    USERS.filter((existingUser) => {
      return (
        existingUser.name === user.name || existingUser.email === user.email
      );
    }).length > 0
  ) {
    return UserResponses.ALREADY_TAKEN;
  }
  let hashedPassword;
  try {
    await bcrypt.hash(user.password, saltRounds, async (err, hash) => {
      if (err) {
        console.error(err);
        return "ERROR!";
      } else {
        hashedPassword = hash;
        const newUser = {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          isAdmin: user.isAdmin || false,
        };
        USERS.push(newUser);
        INFORMATION.push({ email: user.email, info: `${user.name} info` });
      }
    });
    return UserResponses.SUCCESS;
  } catch ({ message }) {
    console.log(
      "ERROR WITH createUser() at userController.ts at line ~14, ",
      message
    );
    return UserResponses.ERROR;
  }
};
const loginUser = async (user) => {
  const isUser = USERS.filter((existingUser) => {
    return existingUser.email === user.email;
  })[0];
  if (!isUser) return { res: UserResponses.USER_NOT_FOUND };
  const isValidated = await bcrypt.compare(user.password, isUser.password);
  if (isValidated) {
    user.password = "";
    const accessToken = await generateAccessToken(isUser);
    const refreshToken = await generateRefreshToken(isUser.name);
    return {
      res: UserResponses.SUCCESS,
      accessToken,
      name: isUser.name,
      email: isUser.email,
      isAdmin: isUser.isAdmin,
      refreshToken,
    };
  } else {
    return { res: UserResponses.INCORRECT_INPUT };
  }
};
const getUserInfoByMail = (email) => {
  const userInfo = INFORMATION.find((userEmail) => userEmail.email === email);
  if (userInfo) {
    return [{ user: userInfo.email, info: userInfo.info }];
  }
};

createUser(adminUser);

module.exports = {
  createUser,
  loginUser,
  getUserInfoByMail,
  generateAccessToken,
  generateRefreshToken,
  USERS,
  OPTIONS,
  tokenSecret,
  refreshTokenSecret,
};
