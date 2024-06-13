import app from "./app";
import { db } from "./db";
import { env } from "./helper"
app.listen(env.PORT, async () => {
    await db.initialize()
    console.log(`server start at http://localhost:${env.PORT}`);
})