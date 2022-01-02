import fs from "fs"
import path from "path";
import config from "config";

const filesDic = config.get<string>("filesDic");

function getFilePathByFileName(fileName: string){
    if (fileName.includes('/') || fileName.includes("\\") || fileName.includes("..")){
        return null;
    }
    const filePath = path.resolve(`${filesDic}/${fileName}`)
    return filePath;
}

async function deletePicture(fileName: string){
    const fileFullPath = getFilePathByFileName(fileName);
    fs.unlink(fileFullPath, (err) => {
        if (err) throw "File Doesn't Exists"    
    })
}

async function isFileExists(filePath: string){
    let isExists = false
    try{
        await fs.promises.access(filePath);
        // if error didn't threw, file is exists.
        isExists = true
      }
      catch(e) {
        isExists = false
      }
      finally{
          return isExists
      }
}

async function saveFile(filePath: string, file: Buffer){
    await fs.writeFile(filePath, file, function (err) {
        if (err) throw err;
    });
    
    // await savingFileFunc(filePath, function(err: Error) {
    //     // Error in saving File.
    //     return err ? res.status(400).send("Somthing went wrong, Please try later.") : null;
    // })    
}

export { deletePicture, getFilePathByFileName, isFileExists, saveFile} 
