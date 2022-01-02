import bcrypt from "bcrypt";
import { CreateUserInput, LoginInput, UserModel } from "../schema/user.schema";
import { signJwt } from "../utils/jwt";

class UserService {
  static async createUser(input: CreateUserInput) {
    const {phone} = input;
    const userWithInputPhone = await UserModel.find().findByPhone(phone).lean();
    if (userWithInputPhone){
      throw ("Phone Number Already Exists.")
    }
    return UserModel.create(input);    
  }

  static async login(input: LoginInput) {
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

    const token = signJwt(user);
    return token;
  }
}

export default UserService;