const { Router } = require("express");
const mysql = require("mysql");
const questions = Router();

let mysqlCon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "fuckSQL123",
  database: "quizzer",
  multipleStatements: true,
});

mysqlCon.connect((err) => {
  if (err) throw err;
  console.log("connected!");
});

questions.get("/allcountries", (req, res) => {
  mysqlCon.query("SELECT * FROM countries;", (err, results, fields) => {
    if (err) {
      res.send(err.message);
    }
    res.send(results);
  });
});

// questions.get('/songs/:id', (req, res) => {
//     let queryString = 'SELECT * FROM songs WHERE id = '+ req.params.id;
//     mysqlCon.query(queryString, (err, results, fields) => {
//         if(err){
//             res.send(err.message);
//         } else if (results && results.length === 1){
//             res.send(results[0]);
//         }
//     });
// });

questions.get("/songs/:id", (req, res) => {
  mysqlCon.query(
    "SELECT * FROM songs WHERE id = ? AND Plays > ?",
    [req.params.id, 100],
    (err, results, fields) => {
      console.log(fields);
      if (err) {
        res.send(err.message);
      } else if (results && results.length === 1) {
        res.send(results[0]);
      } else {
        res.send(results);
      }
    }
  );
});

questions.post("/template", (req, res) => {
  mysqlCon.query(
    "INSERT INTO templates SET ?",
    [req.body],
    (err, results, fields) => {
      console.log(fields);
      if (err) {
        res.send(err.message);
      } else {
        res.send(results);
      }
    }
  );
});

questions.put("/song", (req, res) => {
  mysqlCon.query(
    "UPDATE songs SET song_name = ?, youtube_url = ? WHERE id = ?",
    [req.body.song_name, req.body.youtube_url, req.body.id],
    (err, results, fields) => {
      console.log(fields);
      if (err) {
        res.send(err.message);
      } else {
        res.send(results);
      }
    }
  );
});

questions.delete("/song/:id", (req, res) => {
  mysqlCon.query(
    "DELETE FROM songs WHERE id = ?",
    [req.params.id],
    (err, results, fields) => {
      console.log(fields);
      if (err) {
        res.send(err.message);
      } else {
        res.send(results);
      }
    }
  );
});

module.exports = questions;
