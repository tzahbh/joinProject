import express from "express";
import fs from "fs";
import fileupload from "express-fileupload";
import {ServerConfiguration} from "../configuration"
import { getFilePathByFileName } from "./utils/viewUtils";

var router = express.Router();

const filesDic = ServerConfiguration.filesDic;

// Upload Router

// Middleware to upload files
router.use(fileupload());

// Service to upload file.
router.put("/", async (req: express.Request, res: express.Response) => {
  try{
    const { picture: file } = req.files
    
    // Checking if file has been sent.
    if(!file) 
      return res.status(404).send("File was not sended.");
      
    const fileName = file['name'];
    const savingFileFunc = file['mv'];
    const filePath = getFilePathByFileName(fileName)

    // Checking if file Already Exists.
    try{
      await fs.promises.access(filePath);
      return res.status(400).send(`File Name ${fileName} Already Exists.`);
    }
    catch(e) {
      // File is not exists - Saving the file.
      await savingFileFunc(filePath, function(err: Error) {
          return err ? res.status(400).send("Somthing went wrong, Please try later.") : null;
      })
      
      return res.status(201).send(`File ${fileName} Uploaded Successfuly.`);
    }  
  }
  catch(err){
    return res.status(400).send(err) 
  }
  
  });

export { router }