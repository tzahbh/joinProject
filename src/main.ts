const bodyParser = require("body-parser");
const path = require("path")
const fs = require("fs");
import express from "express";
import {router as uploadRouter} from "./routes/upload"

import { ServerConfiguration } from "configuration"
const app = express();
const PORT = ServerConfiguration.PORT;
const filesDic = ServerConfiguration.filesDic;

app.use(bodyParser.json());

app.get("/ping", (req: any, res: any) => {
  res.status(200).send("pong");
});

app.use("/upload", uploadRouter);

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