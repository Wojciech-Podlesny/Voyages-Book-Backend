import { Router } from "express";
import { signIn, signUp ,signOut, verifyToken, changePassword } from "../controllers/auth.controller";


const authRouter = Router()

authRouter.post('/sign-up', signUp)
authRouter.post('/sign-in', signIn)
authRouter.post('/sign-out',  signOut)
authRouter.post('/change-password', changePassword)
authRouter.post('/verify-token', verifyToken)

export default authRouter