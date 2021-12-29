
import { Picture } from "schema/picture.schema"
import PictureService from "../services/picture.service"
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { deletePicture } from "../utils/files"
import LogService from "../services/log.service"
import { LogEventType } from "schema/log.schema";
import { ObjectId } from "bson"
import Context from "types/context";



@Resolver()
export default class pictureResolver {
  
    @Authorized()
    @Query(() => [Picture!]!)
    async getPictures() {
      const uploadedPictures = await PictureService.getAllUploadedPictures();
      if (uploadedPictures.length == 0){
        return "No Pictures In Database."
      }
      return uploadedPictures;
    }

    @Authorized()
    @Mutation(() => String)
    async deletePicture(@Arg("file_name") input: string,@Ctx() context: Context) {
      let message = ''
      try{
        const picture = await PictureService.findOneAndDeleteByFileName(input)
        if (!picture){
          message = "File Doesn't Exists."
        }
        else{
          await deletePicture(input)
          message = "File Deleted"
          const log = {event: LogEventType.delete, description: input, date: Date(), user: new ObjectId(context.user._id)}
          LogService.createLog(log)
        }
          
      } catch(err){
        message = "Somthing Went Wrong Please Try Later."
      }
      return message;
    }
}

