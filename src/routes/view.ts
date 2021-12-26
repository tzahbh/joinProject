import express from "express";
import { getFilePathByFileName, createTransformer } from "./utils/viewUtils"
import {ServerCache} from "../configuration"

var router = express.Router();

// View Router

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
    const filePath = req.file_path
    const cache_key = `view|${filePath}`

    // Retrive the results from cache memory (if found).
    const pictureBufferFromCache = ServerCache.get(cache_key)
    if (pictureBufferFromCache)
      return res.status(200).end(pictureBufferFromCache)
    

    const transformer = createTransformer(filePath);
    const pictureBuffer = await transformer.getBuffer();
    ServerCache.set(cache_key, pictureBuffer)
    
    res.status(200).end(pictureBuffer);
  }
  catch(err){
    res.status(400).send(err);
  }
});

// Service to get transofrmation of picture by type of transformation and file_name
router.get("/:transforms_options/:file_name", viewMiddleware, async (req: express.Request, res: express.Response) => {
  try{
    const filePath = req.file_path;
    const { transforms_options: transformsOptions }  = req.params
    
    if (!transformsOptions){
      return res.status(400).send("Invalid Transforms.");
    }
    
    res.type('image/png');

    // Retrive the results from cache memory (if found).
    const cache_key = `view|${filePath}|${transformsOptions}`
    const pictureBufferFromCache = ServerCache.get(cache_key)
    if (pictureBufferFromCache){
      return res.status(200).end(pictureBufferFromCache)
    }

    // Calculate the results and store it in the cache memory.
    const transformer = createTransformer(filePath, transformsOptions);
    const pictureBuffer = await transformer.getBuffer();
    ServerCache.set(cache_key, pictureBuffer)
        
    return res.status(200).end(pictureBuffer);
  }
  catch(err){
    return res.status(400).send(err);
  }
});


export { router }