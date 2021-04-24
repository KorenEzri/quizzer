const sequelize = require("./sequelize");
const DataTypes = require("sequelize/lib/data-types");
const AnonUsers = require("./models/anonusers")(sequelize, DataTypes);
const QuestionGenerator = require("./QuestionGenerator");

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
const updateUserStatistics = async (user, elapsedTime) => {
  try {
    AnonUsers.increment(
      { timePlayed: `+${elapsedTime}` },
      {
        where: {
          name: `${user}`,
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
const updateHighscore = async (score, user, elapsedTime) => {
  await updateUserStatistics(user, elapsedTime);
  const date = new Date().toISOString().slice(0, 19).replace("T", " ");
  if (QuestionGenerator.verifyScores(score)) {
    try {
      await sequelize.query(`update anonusers
                              set highscore = ${score}
                              where name = "${user}"
                              and highscore < ${score}`);
      await sequelize.query(`update anonusers set highscoreDate="${date}"
      where name="${user}"`);
    } catch ({ message }) {
      console.log(message);
      return "ERROR";
    }
    try {
      AnonUsers.update(
        {
          lastGameScore: score,
          lastGameElapsed: elapsedTime,
        },
        {
          where: {
            name: `${user}`,
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
      await sequelize.query(`update anonusers
                              set highscore = -99999
                              where name = "${user}"`);
      await sequelize.query(`update anonusers set highscoreDate="${date}"
      where name="${user}"`);
      return "Cheater!!";
    } catch ({ message }) {
      console.log(message);
      return "ERROR";
    }
  }
};

module.exports = { createAnonUser, updateHighscore };
