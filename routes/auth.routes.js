import {Router} from "express";
import {signIn, signOut, signUp} from "../controllers/auth.controller.js";
import {signInLimiter, signUpLimiter} from "../middlewares/rateLimit.middleware.js";

const authRouter = Router();

authRouter.post('/sign-up', signUpLimiter, signUp);
authRouter.post('/sign-in', signInLimiter, signIn);
authRouter.post('/sign-out', signOut);

export default authRouter;