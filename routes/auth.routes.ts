import { Router } from "express";
import { signIn, signUp ,signOut, verifyToken, changePassword, refreshToken, requestResetPassword, verifyEmail, resetPassword } from "../controllers/auth.controller";


const authRouter = Router()

authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);
authRouter.post('/sign-out',  signOut);;
authRouter.post('/verify-token', verifyToken);
authRouter.post('/refresh-token', refreshToken);
authRouter.post('/change-password', changePassword);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/request-password-reset', requestResetPassword);
authRouter.post('/verify-email', verifyEmail);

export default authRouter