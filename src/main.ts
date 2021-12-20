const express = require("express");
const bodyParser = require("body-parser");
var router = express.Router();

const app = express();
const PORT = 8888;



app.use(bodyParser.json());


app.get("/", (req, res) => {
  res.send("dev api status - up");
});


app.listen(PORT);
console.log("server running", PORT);