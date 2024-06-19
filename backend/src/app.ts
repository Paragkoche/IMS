import express from "express";
import v1Routeing from "./router";
const app = express();
app.use(express.json());

app.use("/api/v1", v1Routeing)

export default app