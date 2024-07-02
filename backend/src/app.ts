import express from "express";
import v1Routeing from "./router";
import cookie from "cookie-parser";
import { checkAuth } from "./helper/auth";
const app = express();
app.use(express.json());
app.use(cookie());
app.use("/static", checkAuth, express.static("static"));
app.use("/api/v1", v1Routeing);

export default app;
