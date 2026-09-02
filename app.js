import express from 'express';
import {PORT} from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";

const app = express();

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/subscription", subscriptionRoutes)

app.get('/', (req, res)=> {
    res.send('Hello World!');
})

app.listen(PORT, ()=> {
    console.log('Example app listening on port ${PORT}}', PORT);
})

export default app;