import {
    getModelForClass,
    prop,
    ReturnModelType,
    queryMethod,
    index,
  } from "@typegoose/typegoose";
import { AsQueryMethod } from "@typegoose/typegoose/lib/types";
import { Field, ObjectType } from "type-graphql";
import { IsDate, IsEnum } from "class-validator";
import { User } from "./user.schema";
import {ObjectId} from "bson"

export enum LogEventType {
  "view" = "view",
  "upload" = "upload",
  "delete" = "delete"
 }

function findByLogEventType(
  this: ReturnModelType<typeof Log, QueryHelpers>,
    LogEventType: Log["event"]) {
  return this.find({LogEventType})
}

interface QueryHelpers {
  findByLogEventType
: AsQueryMethod<typeof findByLogEventType>;
}

@index({event: 1, user_id: 1})
@queryMethod(findByLogEventType
)
@ObjectType()
export class Log {
    @Field(() => String)
    _id: ObjectId;

    @Field(() => User)
    @prop({ required: true , ref: "User"})
    user: ObjectId;
    
    @Field(() => String)
    @prop({ required: true})
    event: string;

    @Field(() => Date)
    @prop({ required: true })
    date: Date;

    @Field(() => String)
    @prop({ required: true })
    description: string

}

export const LogModel = getModelForClass<typeof Log, QueryHelpers>(Log);

export class CreateLogInput {
    
  @IsEnum(LogEventType)
  event: LogEventType;
  
  @IsDate()
  date: string;
  user: ObjectId;
  description: string;
}

export class getLogInput {
  @IsEnum(LogEventType)
  event?: LogEventType;
  @IsDate()
  date?: string;
  user_id?: string;
}

