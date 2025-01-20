import express from "express";
import "dotenv/config";
import router from "./Routes/router";
import { connectDB } from "./config/db";
import bodyParser from "body-parser";
import cors from "cors";
import { corsOptions } from "./config/cors";

const app = express();

connectDB();

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use("/", router);

export default app;
