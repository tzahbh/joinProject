import bodyParser from "body-parser";
import express from "express";
import {router as uploadRouter} from "./routes/upload"
import {router as viewRouter} from "./routes/view"
import { ServerConfiguration } from "configuration"

const app = express();
const PORT = ServerConfiguration.PORT;

app.use(bodyParser.json());

app.get("/ping", (req: express.Request, res: express.Response) => {
  res.status(200).send("pong");
});

app.use("/upload", uploadRouter);
app.use("/view", viewRouter);

app.listen(PORT);
console.log("server running", PORT);