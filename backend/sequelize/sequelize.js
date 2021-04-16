const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("quizzer", "root", "fuckSQL123", {
  host: "127.0.0.1",
  dialect: "mysql",
});

const connectSQL = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
connectSQL();

module.exports = sequelize;
