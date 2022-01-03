import { getFilePathByFileName, isFileExists, deletePicture, saveFile } from "../../src/utils/files"

beforeAll(async () => {
    const TestFileName = "test1.jpg"
    const filePath = getFilePathByFileName(TestFileName)
    await saveFile(filePath, Buffer.from("Test1"));
  });

afterAll(async () => {
    await deletePicture("test1.jpg")       
})

describe("src/utils/files.ts", () => {  

    it("getFilePathByFileName - Redirect To Another Directory", async () => {
        expect.assertions(1);
        const fileName = "../test1.jpg"
        const filePath = getFilePathByFileName(fileName) 
        expect(filePath).toBe(null)
    })

    it("getFilePathByFileName - Validation", async () => {
        expect.assertions(1);
        const fileName = "test1.jpg"
        const filePath = getFilePathByFileName(fileName)
        expect(filePath).toBe("/Users/tzahbenhamo/Documents/GitHub/joinProject/files/test1.jpg")
    })

    it("isFileExists - File Already exists", async () => {
        expect.assertions(1);
        const fileName = "test1.jpg"
        const filePath = getFilePathByFileName(fileName) 
        const result = await isFileExists(filePath)
        expect(result).toBe(true)
    })

    it("isFileExists - File Doesn't exists", async () => {
        expect.assertions(1);
        const fileName = "test3.jpg"
        const filePath = getFilePathByFileName(fileName) 
        const result = await isFileExists(filePath)
        expect(result).toBe(false)
    })

    it("saveFile - File Saved", async () => {
        expect.assertions(1);
        try{
        const fileName = "test2.jpg";
        const filePath = getFilePathByFileName(fileName);
        const demoBuffer = Buffer.from("test");
        await saveFile(filePath, demoBuffer);
        const result = await isFileExists(filePath);
        expect(result).toBe(true);
        }
        catch(e){
            console.log(e)
        }
        finally{
            await deletePicture("test2.jpg")
        }
           
    })
     
});