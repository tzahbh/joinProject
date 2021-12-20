const bodyParser = require("body-parser");
const path = require("path")
const fs = require("fs");
import express from "express";

var fileupload = require("express-fileupload");
var router = express.Router();

const app = express();
const PORT = 8888;
const filesDic = "files";


app.use(bodyParser.json());


app.get("/ping", (req: any, res: any) => {
  res.status(200).send("pong");
});

app.use(fileupload());


app.put("/upload", (req: any, res: any) => {

  if(!req.files.picture)
    {
        res.status(404).send("File was not found");
        return;
    }

  const file = req.files.picture;
  const fileName = file.name;
  const filePath = path.resolve(`${filesDic}/${fileName}`)

  if (fs.existsSync(filePath)) { 
      res.status(400).send(`File Name ${fileName} Already Exists.`);
  }
  else{
    file.mv(filePath, function(err: any) {
      if (err)
       return res.status(500).send(err);
    });
  }
  res.status(201).send(`File Uploaded ${fileName}`);
  });

app.get("/view/:file_name", (req: any, res: any) => {
  const fileName = req.params.file_name ? req.params.file_name : null;
  const filePath = path.resolve(`${filesDic}/${fileName}`)
  if (fs.existsSync(filePath)) { 
      res.status(200).download(filePath);
  }
  else{
      res.status(404).send(`${fileName} is not Found.`);
  }
})


app.listen(PORT);
console.log("server running", PORT);