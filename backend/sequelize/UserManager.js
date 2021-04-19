const AnonUsers = require("../sequelize/models/AnonUsers");
const sequelize = require("../sequelize/sequelize");
const { Sequelize } = require("sequelize");

const createAnonUser = async (user) => {
  try {
    const [newAnon, created] = await AnonUsers.findOrCreate({
      where: { name: user },
      defaults: { id: 0, name: user, highscore: null, highscore_date: null },
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

const updateHighscore = async (score, user) => {
  try {
    await sequelize.query(`update anon_users
                            set highscore = ${score}
                            where name = "${user}"
                            and highscore < ${score}`);

    await sequelize.query(`update anon_users set highscore_date=${new Date()}) 
    where name="${user}"`);
    return "OK";
  } catch ({ message }) {
    console.log(message);
    return "ERROR";
  }
};

module.exports = { createAnonUser, updateHighscore };
