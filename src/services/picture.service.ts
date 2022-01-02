import { PictureModel, CreatePictureInput } from "../schema/picture.schema";

class PictureService {

  static async createPictures(input: CreatePictureInput) {
    return PictureModel.create(input);
  }

  static async findOneAndDeleteByFileName(fileName: string) {
    const picture =  await PictureModel.findOneAndDelete({file_name: fileName});
    return picture
  }

  static async getAllUploadedPictures() {
    try {
        let data = await PictureModel.find().populate({path: "uploaded_by", select: "name phone"});
        return data
    } catch (err) {
        console.log(err)
        return []
    }
  }
}



export default PictureService;