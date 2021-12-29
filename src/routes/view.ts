import express from "express";
import { createTransformer } from "../utils/sharp"
import { getFilePathByFileName } from "../utils/files"
import LogService from "../services/log.service"
import { LogEventType } from "../schema/log.schema"
import {ServerCache} from "../utils/cache"
import { User } from "schema/user.schema";

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
const viewMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try{
  const { file_name: fileName} = req.params;

  if(!fileName)
    return res.status(400).send("'File Name' Paramater didn't found.");


  const filePath = getFilePathByFileName(fileName)
  
  if (filePath) {
      req.file_path = filePath;
      return next();
  }
  return res.status(404).send(`File Name '${fileName}' is not Found.`);
}
catch(err){
  return res.status(500).send(`Unknown server error.`)
}
};

router.get("/:file_name", viewMiddleware, async (req: express.Request, res: express.Response) => {
  try{
    res.type('image/png');
    const { file_name: fileName } = req.params
    const filePath = req.file_path
    const operationKey = `view|${fileName}`

    let pictureBuffer = null;

    // Log Deatils, Saved only if operation successed.
    const user = <User> req.user
    const log = {event: LogEventType.view, description: operationKey, date: Date(), user: user._id}
    

    // Retrive the results from cache memory (if found).
    const pictureBufferFromCache = ServerCache.get(operationKey)
    console.log(pictureBufferFromCache)
    if (pictureBufferFromCache){
      pictureBuffer = pictureBufferFromCache;
    }
    else{
      const transformer = createTransformer(filePath);
      pictureBuffer = await transformer.getBuffer();
      ServerCache.set(operationKey, pictureBuffer); // store in cache.
    } 
    
    LogService.createLog(log); // save log.
    return res.status(200).end(pictureBuffer);
  }
  catch(err){
    return res.status(400).send(err);
  }
});

// Service to get transofrmation of picture by type of transformation and file_name
router.get("/:transforms_options/:file_name", viewMiddleware, async (req: express.Request, res: express.Response) => {  
  try{
    const {file_name: fileName} = req.params
    const filePath = req.file_path;
    const { transforms_options: transformsOptions }  = req.params
    const operationKey = `view|${fileName}|${transformsOptions}`

    let pictureBuffer = null;

    // Log Deatils, Saved only if operation successed.
    const user = <User> req.user
    const log = {event: LogEventType.transform_view, description: operationKey, date: Date(), user: user._id}
    
    if (!transformsOptions){
      return res.status(400).send("Invalid Transforms.");
    }
    
    res.type('image/png');

    // Retrive the results from cache memory (if found).
    const pictureBufferFromCache = ServerCache.get(operationKey)
    if (pictureBufferFromCache){
      pictureBuffer = pictureBufferFromCache
    }
    else{
      const transformer = createTransformer(filePath, transformsOptions);
      pictureBuffer = await transformer.getBuffer();
      ServerCache.set(operationKey, pictureBuffer); // store it in the cache memory.
    }

    LogService.createLog(log)
    return res.status(200).end(pictureBuffer);
  }
  catch(err){
    return res.status(400).send(err);
  }
});

export { router }