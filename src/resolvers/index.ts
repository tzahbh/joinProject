import UserResolver from "./user.resolver";
import pictureResolver from "./picture.resolver";

export const resolvers = [UserResolver, pictureResolver] as const;