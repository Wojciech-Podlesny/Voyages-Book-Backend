import { Router } from "express";
import { signIn, signUp ,signOut, verifyToken, changePassword } from "../controllers/auth.controller";
import validate from "../middlewares/validate.middleware";


const authRouter = Router()

authRouter.get('/sign-up', validate, signUp)
authRouter.post('/sign-in', validate, signIn)
authRouter.post('/sign-out', validate, signOut)
authRouter.post('/change-password', validate, changePassword)
authRouter.post('/verify-token', validate, verifyToken)

export default authRouter