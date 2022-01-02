import { AuthChecker } from "type-graphql";
import Context from "../types/context";

const authChecker: AuthChecker<Context> = ({ context }) => {
  const {user} = context
  return user? true : false;
};

export default authChecker;