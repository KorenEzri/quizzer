const AnonUsers = require("../sequelize/models/AnonUsers");
const QuestionGenerator = require("./QuestionGenerator");
const sequelize = require("../sequelize/sequelize");
const users = require("../routes/users");

const createAnonUser = async (user) => {
  try {
    const [newAnon, created] = await AnonUsers.findOrCreate({
      where: { name: user },
      defaults: { id: 0, name: user, highscore: 0, highscore_date: null },
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
      { time_played: `+${elapsedTime}` },
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
      await sequelize.query(`update anon_users
                              set highscore = ${score}
                              where name = "${user}"
                              and highscore < ${score}`);
      await sequelize.query(`update anon_users set highscore_date="${date}"
      where name="${user}"`);
    } catch ({ message }) {
      console.log(message);
      return "ERROR";
    }
    try {
      AnonUsers.update(
        {
          last_game_score: score,
          last_game_elapsed: elapsedTime,
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
      await sequelize.query(`update anon_users
                              set highscore = -99999
                              where name = "${user}"`);
      await sequelize.query(`update anon_users set highscore_date="${date}"
      where name="${user}"`);
      return "Cheater!!";
    } catch ({ message }) {
      console.log(message);
      return "ERROR";
    }
  }
};

module.exports = { createAnonUser, updateHighscore };
