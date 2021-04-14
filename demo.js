const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.json());

let mysqlCon = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "quizzer",
    multipleStatements: true,
});

mysqlCon.connect(err=> {
    if (err) throw err;
    console.log("connected!");
}); 

app.get('/songs', (req, res) => {
    mysqlCon.query('SELECT * FROM countries;', (err, results, fields) => {
        if(err){
            res.send(err.message);
        }
        res.send(results);
    });
});

// app.get('/songs/:id', (req, res) => {
//     let queryString = 'SELECT * FROM songs WHERE id = '+ req.params.id;
//     mysqlCon.query(queryString, (err, results, fields) => {
//         if(err){
//             res.send(err.message);
//         } else if (results && results.length === 1){
//             res.send(results[0]);
//         }
//     });
// });

app.get('/songs/:id', (req, res) => {
    mysqlCon.query('SELECT * FROM songs WHERE id = ? AND Plays > ?', [req.params.id, 100], (err, results, fields) => {
        console.log(fields);
        if(err){
            res.send(err.message);
        } else if (results && results.length === 1){
            res.send(results[0]);
        } else {
            res.send(results);
        }
    });
});

app.post('/template', (req, res) => {
    mysqlCon.query('INSERT INTO templates SET ?', [req.body], (err, results, fields) => {
        console.log(fields);
        if(err){
            res.send(err.message);
        } else {
            res.send(results);
        }
    });
});

app.put('/song', (req, res) => {
    mysqlCon.query('UPDATE songs SET song_name = ?, youtube_url = ? WHERE id = ?', [req.body.song_name, req.body.youtube_url, req.body.id], (err, results, fields) => {
        console.log(fields);
        if(err){
            res.send(err.message);
        } else {
            res.send(results);
        }
    });
});


app.delete('/song/:id', (req, res) => {
    mysqlCon.query('DELETE FROM songs WHERE id = ?', [req.params.id], (err, results, fields) => {
        console.log(fields);
        if(err){
            res.send(err.message);
        } else {
            res.send(results);
        }
    });
});



app.listen(3000);