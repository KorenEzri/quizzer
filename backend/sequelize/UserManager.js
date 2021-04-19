const AnonUsers = require("../sequelize/models/AnonUsers");
const { Sequelize } = require("sequelize");

const createAnonUser = async (user) => {
  try {
    await AnonUsers.create({
      id: 0,
      name: user,
      highscore: null,
      highscore_date: null,
    });
    return "OK";
  } catch ({ message }) {
    console.log(message);
    return "ERROR";
  }
};

module.exports = { createAnonUser };
