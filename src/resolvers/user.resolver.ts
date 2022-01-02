import { CreateUserInput, LoginInput, User } from "schema/user.schema";
import UserService from "services/user.service";
import { Arg, Ctx, Mutation, Query, Resolver  } from "type-graphql";
import Context from "types/context";

@Resolver()
export default class UserResolver {

    @Mutation(() => User)
    createUser(@Arg("input") input: CreateUserInput) {
      return UserService.createUser(input);
    }
  
    @Query(() => String) //
    login(@Arg("input") input: LoginInput) {
      return UserService.login(input);
    }

    @Query(()=> User, { nullable: true })
    me(@Ctx() context: Context){
        return context.user
    }

}