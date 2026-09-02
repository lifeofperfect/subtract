import express from 'express';
import {PORT} from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import connectToDb from "./database/mongodb.js";
import errorMidleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(errorMidleware);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/subscription", subscriptionRoutes)

app.get('/', (req, res)=> {
    res.send('Hello World!');
})

app.listen(PORT, async ()=> {
    console.log('Example app listening on port ${PORT}}', PORT);

    await connectToDb()
})

export default app;