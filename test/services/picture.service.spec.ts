import dotenv from "dotenv"
dotenv.config();
import PictureService from "../../src/services/picture.service"
import {MongoDB} from "../../src/utils/mongo";
import {ObjectId} from "bson"
import c from "config";
MongoDB.initConnection()

describe("src/services/picture.service.ts", () => {
    beforeAll(async () =>{
        const demoPicture = {file_name: "test1.test", uploaded_by: new ObjectId("100000000000000000000000")}
        await PictureService.createPictures(demoPicture)
    })

    afterAll(()=>{
        PictureService.findOneAndDeleteByFileName("test1.test")
    })

    it("getAllUploadedPictures - At Least 1 Picture is return", async () => {
        expect.assertions(1);
        const allPictures = await PictureService.getAllUploadedPictures();
        expect(allPictures.length).toBeGreaterThan(0);
    })
    
    it("FindOneAndDeleteByFileName - Should find the picture and delete it", async () => {
        expect.assertions(3);
        const fileName = "test1.test";
        const picture = await PictureService.findOneAndDeleteByFileName(fileName);
        expect(picture.file_name).toBe("test1.test");
        expect(picture.uploaded_by.toString()).toBe("100000000000000000000000");
        const picture2 = await PictureService.findOneAndDeleteByFileName("test1.test");
        expect(picture2).toBe(null)
    })
    
});