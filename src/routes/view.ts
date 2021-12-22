import express from "express";
import { getFilePathByFileName, parseTransformsOption, customizePicture } from "./utils/viewUtils"

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

router.get("/:file_name", viewMiddleware, (req: express.Request, res: express.Response) => {
  try{
    const filePath = req.file_path
    res.status(200).download(filePath);
  }
  catch(err){
    res.status(400).send(err);
  }
});

// Service to get transofrmation of picture by type of transformation and file_name
router.get("/:transforms_options/:file_name", viewMiddleware, async (req: express.Request, res: express.Response) => {
  try{
    const filePath = req.file_path;
    const transformsOptions = req.params.transforms_options ? req.params.transforms_options : null;

    if (!transformsOptions){
      return res.status(400).send("Invalid Transforms.");
    }

    const transformsOptionsParsed = parseTransformsOption(transformsOptions);

    const pictureBuffer = await customizePicture(filePath, transformsOptionsParsed)

    res.type('image/png');
    return res.status(200).end(pictureBuffer);
    }
  catch(err){
    return res.status(400).send(err);
  }

});




export { router }