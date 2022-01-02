import {
    getModelForClass,
    prop,
  } from "@typegoose/typegoose";
import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "./user.schema";
import {ObjectId} from "bson"


interface QueryHelpers {
}

@ObjectType()
export class Picture {

  @Field(() => String)
  @prop({ required: true })
  file_name: string

  @Field(()=> User)
  @prop({ required: true , ref: "User"})
  uploaded_by: ObjectId;
}

export const PictureModel = getModelForClass<typeof Picture, QueryHelpers>(Picture);

@InputType()
export class CreatePictureInput {
    file_name: string;  
    uploaded_by: ObjectId;
  }
