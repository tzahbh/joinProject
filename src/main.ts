import bodyParser from "body-parser";
import express from "express";
import cookieParser from "cookie-parser";
import {router as uploadRouter} from "./routes/upload";
import {router as viewRouter} from "./routes/view";
import {router as userRouter} from "./routes/users";
import { ServerConfiguration } from "configuration";
import { MongoDB } from "utils/mongo";


MongoDB.initConnection()

const app = express();
const PORT = ServerConfiguration.PORT;

app.use(bodyParser.json());
app.use(cookieParser());

app.get("/ping", (req: express.Request, res: express.Response) => {
  res.status(200).send("pong");
});

app.use("/users", userRouter);
app.use("/upload", uploadRouter);
app.use("/view", viewRouter);

app.listen(PORT);
console.log("server running", PORT);