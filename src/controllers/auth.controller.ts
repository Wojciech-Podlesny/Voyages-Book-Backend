import { Request, Response } from "express"

export const  signIn = async (req: Request, res: Response) => {
   res.send('User registered')
}

export const signUp = async (req: Request, res: Response) => {
   res.send('User logged in')
}

export const signOut = async (req: Request, res: Response) => {
   res.send('User logged out')
}

export const forgotPassword = async (req: Request, res: Response) => {
   res.send('Password reset link sent')
}

export const resetPassword = async (req: Request, res: Response) => {
   res.send('Password has been reset')
}

export const verifyToken = async (req: Request, res: Response) => {
   res.send('Token verified')
}  

export const refreshToken = async (req: Request, res: Response) => {
   res.send('Token refreshed')
}

export const changePassword = async (req: Request, res: Response) => {
   res.send('Password changed')
}