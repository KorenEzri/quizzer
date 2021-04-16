// const { Router } = require("express");
// const mysql = require("mysql");
// const data = Router();

// let mysqlCon = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "fuckSQL123",
//   database: "quizzer",
//   multipleStatements: true,
// });

// mysqlCon.connect((err) => {
//   if (err) throw err;
//   console.log("connected!");
// });

// data.get("/allcountries", (req, res) => {
//   mysqlCon.query("SELECT * FROM countries;", (err, results, fields) => {
//     if (err) {
//       res.send(err.message);
//     }
//     res.send(results);
//   });
// });

// data.get("/country", (req, res) => {
//   mysqlCon.query("SELECT country FROM countries;", (err, results, fields) => {
//     if (err) {
//       res.send(err.message);
//     }
//     res.send(results);
//   });
// });

// module.exports = data;
