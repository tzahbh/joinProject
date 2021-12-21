import express from "express";
const path = require("path");
const fs = require("fs");
var router = express.Router();
var fileupload = require("express-fileupload");
import {ServerConfiguration} from "../configuration"

const filesDic = ServerConfiguration.filesDic;

// Upload Router

// Middleware to upload files
router.use(fileupload());

// Service to upload file.
router.put("/", (req: any, res: any) => {

  if(!req.files.picture)
    {
        res.status(404).send("File was not found");
        return;
    }

  const file = req.files.picture;
  const fileName = file.name;
  const filePath = path.resolve(`${filesDic}/${fileName}`)

  if (fs.existsSync(filePath)) { 
      return res.status(400).send(`File Name ${fileName} Already Exists.`);
  }
  else{
    file.mv(filePath, function(err: any) {
      if (err)
        return res.status(500).send(err);
    });
  }
  res.status(201).send(`File Uploaded ${fileName}`);
  });

export { router }