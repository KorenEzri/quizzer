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

questions.get("/alldata", (req, res) => {
  mysqlCon.query("SELECT * FROM countries;", (err, results, fields) => {
    if (err) {
      res.send(err.message);
    }
    res.send(results);
  });
});

questions.get("/countries", (req, res) => {
  mysqlCon.query("SELECT country FROM countries;", (err, results, fields) => {
    if (err) {
      res.send(err.message);
    }
    res.send(results);
  });
});

questions.get("/templates", (req, res) => {
  mysqlCon.query(
    "SELECT * FROM question_templates;",
    (err, results, fields) => {
      if (err) {
        res.send(err.message);
      }
      res.send(results);
    }
  );
});
const getRandomElements = (array, n) => {
  let count = 0;
  let results = [];
  while (count < n) {
    results.push(array[Math.floor(Math.random() * array.length)]);
    count++;
  }
  return results;
};
questions.get("/question", (req, res) => {
  mysqlCon.query(
    "SELECT * FROM question_templates;",
    (err, allTemplates, fields) => {
      if (err) {
        console.log(err.message);
      }
      if (!allTemplates) {
        res.json({ message: "question failed to reach client" });
      }
      const randomTemplate = getRandomElements(allTemplates, 1);
      const { template_reqs, template } = randomTemplate[0];
      let question;
      let countryList;
      mysqlCon.query(
        "SELECT country FROM countries",
        (err, countries, fields) => {
          if (err) {
            console.log(err.message);
          }
          switch (template_reqs) {
            case "list":
              countryList = getRandomElements(countries, 4);
              question = { question: template, choices: countryList };
              break;
            case "XY":
              countryList = getRandomElements(countries, 2);
              question = template.replace(/X/g, countryList[0].country);
              question = {
                question: `${question.replace(/Y/g, countryList[1].country)}?`,
                choices: [
                  `${countryList[0].country}`,
                  `${countryList[1].country}`,
                  "Trick question - neither one!",
                ],
              };
              break;
            default:
              let country = getRandomElements(countries, 1)[0];
              question = {
                question: `${template}${country.country}?`,
                choices: "",
              };
              break;
          }
          res.send(question);
        }
      );
    }
  );
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

// questions.get("/songs/:id", (req, res) => {
//   mysqlCon.query(
//     "SELECT * FROM songs WHERE id = ? AND Plays > ?",
//     [req.params.id, 100],
//     (err, results, fields) => {
//       console.log(fields);
//       if (err) {
//         res.send(err.message);
//       } else if (results && results.length === 1) {
//         res.send(results[0]);
//       } else {
//         res.send(results);
//       }
//     }
//   );
// });

// questions.post("/template", (req, res) => {
//   mysqlCon.query(
//     "INSERT INTO templates SET ?",
//     [req.body],
//     (err, results, fields) => {
//       console.log(fields);
//       if (err) {
//         res.send(err.message);
//       } else {
//         res.send(results);
//       }
//     }
//   );
// });

// questions.put("/song", (req, res) => {
//   mysqlCon.query(
//     "UPDATE songs SET song_name = ?, youtube_url = ? WHERE id = ?",
//     [req.body.song_name, req.body.youtube_url, req.body.id],
//     (err, results, fields) => {
//       console.log(fields);
//       if (err) {
//         res.send(err.message);
//       } else {
//         res.send(results);
//       }
//     }
//   );
// });

// questions.delete("/song/:id", (req, res) => {
//   mysqlCon.query(
//     "DELETE FROM songs WHERE id = ?",
//     [req.params.id],
//     (err, results, fields) => {
//       console.log(fields);
//       if (err) {
//         res.send(err.message);
//       } else {
//         res.send(results);
//       }
//     }
//   );
// });

module.exports = questions;
