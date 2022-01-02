import express from "express";
import { createTransformer } from "../utils/sharp";
import { getFilePathByFileName } from "../utils/files";
import LogService from "../services/log.service";
import { LogEventType } from "../schema/log.schema";
import {ServerCache} from "../utils/cache";
import { User } from "schema/user.schema";
import fs from "fs";
var router = express.Router();

// View Router
// Middleware for authorization
router.use((req: express.Request, res: express.Response, next: express.NextFunction)=>{
  if (req.user) { 
    return(next()); 
  }
  else {
    res.status(403).send("Unauthorized.")
  }
})

// Service to get picture by file name of picture.
const viewMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { file_name: fileName} = req.params;
  try{
    if(!fileName)
      return res.status(400).send("'File Name' Paramater didn't found.");

    const filePath = getFilePathByFileName(fileName)
    await fs.promises.access(filePath);
    req.file_path = filePath;
    req.operationKey = `view/${req.url}`
    
    // Log Deatils, Saved only if operation successed.
    const user = <User> req.user
    const log = {event: LogEventType.view, description: req.operationKey, date: Date(), user: user._id}
    LogService.createLog(log)

    const pictureBufferFromCache = ServerCache.get(req.operationKey)
    if (pictureBufferFromCache){
      return res.type('image/png').status(200).end(pictureBufferFromCache);
    }
    return next();
  }
  catch(err){
    return res.status(404).send(`File Name '${fileName}' is not Found.`);
  }
};

router.get("/:file_name", viewMiddleware, async (req: express.Request, res: express.Response) => {
  try{
    const filePath = req.file_path
  
    // Retrive the results from cache memory (if found).    
    const transformer = createTransformer(filePath);
    const pictureBuffer = await transformer.getBuffer();
    ServerCache.set(req.operationKey, pictureBuffer); // store in cache.
    
    return res.type('image/png').status(200).end(pictureBuffer);
  }
  catch(err){
    return res.status(400).send(err);
  }
});

// Service to get transofrmation of picture by type of transformation and file_name
router.get("/:transforms_options/:file_name", viewMiddleware, async (req: express.Request, res: express.Response) => {  
  try{
    const filePath = req.file_path;
    const { transforms_options: transformsOptions }  = req.params
    
    const transformer = createTransformer(filePath, transformsOptions);
    const pictureBuffer = await transformer.getBuffer();
    ServerCache.set(req.operationKey, pictureBuffer); // store it in the cache memory.

    return res.type('image/png').status(200).end(pictureBuffer);
  }
  catch(err){
    return res.status(400).send(err);
  }
});

export { router }