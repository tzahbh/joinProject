import {
    getModelForClass,
    prop,
    pre,
    ReturnModelType,
    queryMethod,
    index,
  } from "@typegoose/typegoose";
  import { AsQueryMethod } from "@typegoose/typegoose/lib/types";
  import { Field, InputType, ObjectType } from "type-graphql";
  import bcrypt from "bcrypt";
import { MaxLength, MinLength , Length} from "class-validator";
import {ObjectId} from "bson"


  function findByPhone(
    this: ReturnModelType<typeof User, QueryHelpers>,
     phone: User["phone"]
  ) {
    return this.findOne({ phone });
  }
  
  interface QueryHelpers {
    findByPhone: AsQueryMethod<typeof findByPhone>;
  }
  

@pre<User>("save", async function () {
    // Check that the password is being modified
    if (!this.isModified("password")) {
      return;
    }
  
    const salt = await bcrypt.genSalt(10);
  
    const hash = await bcrypt.hashSync(this.password, salt);
  
    this.password = hash;
})

@index({phone: 1})
@queryMethod(findByPhone)
@ObjectType()
export class User {
    @Field(() => String)
    _id: ObjectId;

    @Field(() => String)
    @prop({ required: true })
    name: string;

    @Field(() => String)
    @prop({ required: true, unique: true})
    phone: string;

    @prop({ required: true })
    password: string;
}

export const UserModel = getModelForClass<typeof User, QueryHelpers>(User);

@InputType()
export class CreateUserInput {
    @Field(() => String)
    name: string;
  
    @Length(10, 10, {
        message: "password must be exactliy 10 characters",
    })
    @Field(() => String)
    phone: string;
  
    @MinLength(4, {
        message: "password must be at least 4 characters long",
    })
    @MaxLength(12, {
        message: "password must not be longer than 50 characters",
    })
    @Field(() => String)
    password: string;
  }
  
  @InputType()
  export class LoginInput {
    @Field(() => String)
    phone: string;
  
    @Field(() => String)
    password: string;
  }