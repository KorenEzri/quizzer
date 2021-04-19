const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const { api } = require("./routes");
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api", api);
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "/client/build/index.html"));
// });
module.exports = app;
