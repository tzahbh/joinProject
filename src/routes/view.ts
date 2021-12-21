import express from "express";
const path = require("path");
const fs = require("fs");
var router = express.Router();
import {ServerConfiguration} from "../configuration"

const filesDic = ServerConfiguration.filesDic;

// View Router

// Service to get picture by file name of picture.
router.get("/:file_name", (req: any, res: any) => {
  const fileName = req.params.file_name ? req.params.file_name : null;
  const filePath = path.resolve(`${filesDic}/${fileName}`)
  if (fs.existsSync(filePath)) { 
      res.status(200).download(filePath);
  }
  else{
      res.status(404).send(`${fileName} is not Found.`);
  }
});

export { router }