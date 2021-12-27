import dotenv from "dotenv";
dotenv.config();
import config from "config";
import Context from "types/context";
import authChecker from "./utils/authChecker";
import {ApolloServer} from "apollo-server-express";
import bodyParser from "body-parser";
import express from "express";
import cookieParser from "cookie-parser";
import {router as uploadRouter} from "./routes/upload";
import {router as viewRouter} from "./routes/view";
import {router as userRouter} from "./routes/users";
import { buildSchema} from "type-graphql";
import {resolvers} from "./resolvers";
import {MongoDB} from "utils/mongo";
import {User} from "schema/user.schema";
import {verifyJwt} from "./utils/jwt"
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  // ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import "reflect-metadata";

async function bootstrap() {

  const schema = await buildSchema({
    resolvers,
    authChecker,
  });

  MongoDB.initConnection()

  const app = express();
  const PORT = config.get<number>("serverPort");




const server = new ApolloServer({
    schema,
    context: (ctx: Context) => {
      const context = ctx;

      if (ctx.req.cookies.accessToken) {
        const user = verifyJwt<User>(ctx.req.cookies.accessToken);
        context.user = user;
      }
      return context;
    },
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  await server.start();
  server.applyMiddleware({ app });

  app.use(bodyParser.json());
  // app.use(cookieParser());

  app.use((req: express.Request, res: express.Response, next: express.NextFunction)=>{
    const token = <string> req.headers['x-token']
    if (token) {
      const user = verifyJwt<User>(token);
      req.user = user;
    }
    next()
  })

  app.get("/ping", (req: express.Request, res: express.Response) => {
    res.status(200).send("pong");
  });

  app.use("/users", userRouter);
  app.use("/upload", uploadRouter);
  app.use("/view", viewRouter);

  app.listen(PORT);
  console.log("server running", PORT);

}
bootstrap();