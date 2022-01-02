import express from "express";
import fs from "fs";
import fileupload from "express-fileupload";
import { getFilePathByFileName, isFileExists, saveFile } from "../utils/files";
import { User } from "schema/user.schema";
import { LogEventType } from "schema/log.schema";
import LogService from "services/log.service";
import { ObjectId } from "bson"
import PictureService from "services/picture.service";

var router = express.Router();

// Upload Router

// Middleware for authorization
router.use((req: express.Request, res: express.Response, next: express.NextFunction)=>{
  if (req.user) { 
    return(next()); 
  }
  else {
    res.status(403).send("Unauthorized.")
  }
})

// Middleware to upload files
router.use(fileupload());

// Service to upload file.
router.put("/", async (req: express.Request, res: express.Response) => {
  try{
    const { picture: file } = req.files
    
    // Checking if file has been sent.
    if(!file) 
      return res.status(404).send("File was not sended.");
    
    const buffer = file['data']
    const fileName = file['name'];
    const filePath = getFilePathByFileName(fileName)

    // Log Deatils, Saved only if operation successed.
    const user = <User> req.user
    const log = {event: LogEventType.upload, description: fileName, date: Date(), user: new ObjectId(user._id)}
    const picture = {file_name: fileName, uploaded_by: new ObjectId(user._id)}
    
    // Checking if file Already Exists.
    if (await isFileExists(filePath)){
      return res.status(400).send(`File Name ${fileName} Already Exists.`);
    }
    
    await saveFile(filePath, buffer)
    PictureService.createPictures(picture)
    LogService.createLog(log) // save the log.
    return res.status(201).send(`File ${fileName} Uploaded Successfuly.`);  
  }
  catch(err){
    return res.status(400).send(err) 
  }
  });

export { router }

