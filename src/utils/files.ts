import fs from "fs"
import path from "path";
import config from "config";

const filesDic = config.get<string>("filesDic");

function getFilePathByFileName(fileName: string){
    if (fileName.includes('/') || fileName.includes("\\")){
        return null;
    }
    const filePath = path.resolve(`${filesDic}/${fileName}`)
    return filePath;
}

async function deletePicture(fileName: string){
    const fileFullPath = getFilePathByFileName(fileName);
    fs.unlink(fileFullPath, (err) => {
        if (err) throw err    
    })
}

export { deletePicture, getFilePathByFileName}
