import { Router } from "express";
import { signIn, signUp ,signOut, forgotPassword, resetPassword, verifyToken } from "../controllers/auth.controller";


const authRouter = Router()

authRouter.get('/sign-up', signUp)
authRouter.post('/sign-in', signIn)
authRouter.post('/sign-out', signOut)
authRouter.post('/forgot-password',forgotPassword)
authRouter.post('/reset-password', resetPassword)
authRouter.post('/verify-token', verifyToken)

export default authRouter