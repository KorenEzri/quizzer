const sequelize = require("./sequelize");
const DataTypes = require("sequelize/lib/data-types");
const AnonUsers = require("./models/anonusers")(sequelize, DataTypes);
const User = require("./models/user")(sequelize, DataTypes);
const QuestionGenerator = require("./QuestionGenerator");

const findAllUsers = async () => {
  return await User.findAll({});
};
const createAnonUser = async (user) => {
  try {
    const [newAnon, created] = await AnonUsers.findOrCreate({
      where: { name: user },
      defaults: { id: 0, name: user, highscore: 0, highscoreDate: null },
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
      "ERROR WITH updateUserStatistics() at UserManager.js at  ~line 23",
      message
    );
  }
};
const updateHighscore = async (score, username, elapsedTime) => {
  await updateUserStatistics(username, elapsedTime);
  const date = new Date().toISOString().slice(0, 19).replace("T", " ");
  if (QuestionGenerator.verifyScores(score)) {
    try {
      await sequelize.query(`update users
                              set highscore = ${score}
                              where username = "${username}"
                              and highscore < ${score}`);
      await sequelize.query(`update users set highscoreDate="${date}"
      where username="${username}"`);
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
        "ERROR WITH updateHighscore() at UserManager.js at ~line 40",
        message
      );
    }
    return "OK";
  } else {
    try {
      await sequelize.query(`update users
                              set highscore = -99999
                              where username = "${username}"`);
      await sequelize.query(`update users set highscoreDate="${date}"
      where username="${username}"`);
      return "Cheater!!";
    } catch ({ message }) {
      console.log(message);
      return "ERROR";
    }
  }
};

module.exports = { createAnonUser, updateHighscore, findAllUsers };
