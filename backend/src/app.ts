import express from "express";
import v1Routeing from "./router";
import cookie from "cookie-parser";
const app = express();
app.use(express.json());
app.use(cookie());

app.use("/api/v1", v1Routeing);

export default app;
