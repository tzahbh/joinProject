import bcrypt from "bcrypt";
import { CreateUserInput, LoginInput, UserModel } from "../schema/user.schema";
import Context from "../types/context";
import { signJwt } from "../utils/jwt";

class UserService {
  async createUser(input: CreateUserInput) {
    const {phone} = input;
    const userWithInputPhone = await UserModel.find().findByPhone(phone).lean();
    if (userWithInputPhone){
      throw ("Phone Number Already Exists.")
    }
    return UserModel.create(input);
    
  }

  async login(input: LoginInput, context: Context) {
    const e = "User or Password doesn't match.";

    // Get our user by phone
    const user = await UserModel.find().findByPhone(input.phone).lean();
    
    if (!user) {
      throw (e)
    }

    // validate the password
    const passwordIsValid = await bcrypt.compare(input.password, user.password);
    if (!passwordIsValid) {
      throw (e)
    }

    // sign a jwt
    const token = signJwt(user);

    // set a cookie for the jwt
    context.res.cookie("accessToken", token, {
      maxAge: 3.154e10, // 1 year
      httpOnly: true,
      domain: "localhost",
      path: "/",
      sameSite: "strict",
    });

    return token;
  }
}

export default UserService;