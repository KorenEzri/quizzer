const sequelize = require("../../sequelize");
const DataTypes = require("sequelize/lib/data-types");
const User = require("../../models/user")(sequelize, DataTypes);
const refreshTokens = require("../../models/refreshtokens")(
  sequelize,
  DataTypes
);
const QuestionGenerator = require("../../QuestionGenerator");

const findAllusers = async () => {
  return await User.findAll({});
};
const findOneUser = async (username) => {
  try {
    return await User.findOne({
      where: {
        username: username,
      },
    });
  } catch ({ message }) {
    console.log("ERROR WITH findOneUser() at sequelize-utils.js at ~line 13");
  }
};
const createRefreshToken = async (token) => {
  try {
    const [newRefreshToken, created] = await refreshTokens.findOrCreate({
      where: { refreshToken: token.refreshToken },
      defaults: {
        refreshToken: token.refreshToken,
        expires: token.expires,
      },
    });
    if (!created) {
      return "Token already taken!";
    }
    if (created) {
      return "OK";
    }
  } catch ({ message }) {
    console.log(
      "ERROR WITH createRefreshToken() at sequelize-utils.js at ~line 25"
    );
    return "ERROR";
  }
};
const createUser = async (user) => {
  try {
    const [newUser, created] = await User.findOrCreate({
      where: { username: user.username },
      defaults: {
        id: 0,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        nickname: user.nickname,
        email: user.email,
        password: user.password,
        highscore: 0,
        highscoreDate: null,
      },
    });
    if (!created) {
      return "Username already taken!";
    }
    if (created) {
      return "OK";
    }
  } catch ({ message }) {
    console.log(message);
    return "ERROR";
  }
};
const updateUserStatistics = async (username, elapsedTime) => {
  try {
    User.increment(
      { timePlayed: `+${elapsedTime}` },
      {
        where: {
          username: `${username}`,
        },
      }
    );
  } catch ({ message }) {
    console.log(
      "ERROR WITH updateUserStatistics() at sequelize-utils.js at ~line 69",
      message
    );
  }
};
const updateHighscore = async (score, username, elapsedTime) => {
  await updateUserStatistics(username, elapsedTime);
  const date = new Date().toISOString().slice(0, 19).replace("T", " ");
  if (QuestionGenerator.verifyScores(score)) {
    try {
      await sequelize.query(`update User
                              set highscore = ${score}
                              where username = "${username}"
                              and highscore < ${score}`);
      await sequelize.query(`update User set highscoreDate="${date}"
      where username ="${username}"`);
    } catch ({ message }) {
      console.log(message);
      return "ERROR";
    }
    try {
      User.update(
        {
          lastGameScore: score,
          lastGameElapsed: elapsedTime,
        },
        {
          where: {
            username: `${username}`,
          },
        }
      );
    } catch ({ message }) {
      console.log(
        "ERROR WITH updateHighscore() at sequelize-utils.js at~line 86",
        message
      );
    }
    return "OK";
  } else {
    try {
      await sequelize.query(`update User
                              set highscore = -99999
                              where username= s"${username}"`);
      await sequelize.query(`update User set highscoreDate="${date}"
      where username="${username}"`);
      return "Cheater!!";
    } catch ({ message }) {
      console.log(message);
      return "ERROR";
    }
  }
};

module.exports = {
  createUser,
  createRefreshToken,
  updateHighscore,
  findAllusers,
  findOneUser,
};
