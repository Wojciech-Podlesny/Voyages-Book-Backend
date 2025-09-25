import { Request, Response } from "express"

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Sign in user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User signed in successfully
 *       401:
 *         description: Invalid credentials
 */
export const signIn = async (req: Request, res: Response) => {
   res.send('User registered')
}

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               name:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *               - name
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 */
export const signUp = async (req: Request, res: Response) => {
   res.send('User logged in')
}

/**
 * @swagger
 * /auth/signout:
 *   post:
 *     summary: Sign out user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User signed out successfully
 */
export const signOut = async (req: Request, res: Response) => {
   res.send('User logged out')
}

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send password reset link
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Password reset link sent
 *       404:
 *         description: User not found
 */
export const forgotPassword = async (req: Request, res: Response) => {
   res.send('Password reset link sent')
}

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 6
 *             required:
 *               - token
 *               - password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */
export const resetPassword = async (req: Request, res: Response) => {
   res.send('Password has been reset')
}

/**
 * @swagger
 * /auth/verify-token:
 *   get:
 *     summary: Verify JWT token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Invalid token
 */
export const verifyToken = async (req: Request, res: Response) => {
   res.send('Token verified')
}  

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh JWT token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
export const refreshToken = async (req: Request, res: Response) => {
   res.send('Token refreshed')
}

// import { Request, Response, NextFunction} from "express"
// import prisma from "src/database/prisma"
// import bcrypt from 'bcryptjs'
// import jwt from "jsonwebtoken"
// import { JWT_EXPIRES_IN, JWT_SECRET } from "src/config/env"



// export const signUp = async (req: Request, res: Response, next: NextFunction) => {
//    try {
//       const {name,email,password} = req.body

//       const existingUser = await prisma.user.findUnique({ where: { email } })

//       if(existingUser) {
//          const error = new Error('User with this email already exists')
//          res.status(409).json({ error: error.message })
//          return
//       }

//       const salt = await bcrypt.genSalt(10)
//       const hashedPassword = await bcrypt.hash(password,salt)  

//       const newUser = await prisma.user.create({data: {name,email,password: hashedPassword}})

//       const token = jwt.sign({userId: newUser.id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN})
//       res.status(201).json({success: true,message: "User created successfully", data: {token, user: newUser}})

//    }
//    catch (error) {
//       next(error)
//    }
// }


// export const  signIn = async (req: Request, res: Response, next: NextFunction) => {
//    const {email,password} = req.body

//    try {
//      const user = await prisma.user.findUnique({ where: { email } })

//        if(!user) {
//          const error = new Error('Invalid email or password')
//          res.status(401).json({ error: error.message })
//          return
//       }

//       const isPasswordValid = await bcrypt.compare(password, user.password)

//       if(!isPasswordValid) {
//          const error = new Error('Invalid email or password')
//          res.status(401).json({ error: error.message })
//          return
//       }

//       const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN})

//       res.status(200).json({success: true,message: "User signed in successfully", data: {token, user}})

      
//    } catch(error) {
//       next(error)
//    }
// }


// export const signOut = async (req: Request, res: Response, next: NextFunction) => {
//   try {

      //  const {userId} = req.body
      // await.prisma.user.update({
      //    where: { id: req.body.userId },
      //    data: { token: null }
      // })
//     res.status(200).json({
//       success: true,
//       message: "User logged out successfully"
//     })
//   } catch (error) {
//     next(error)
// }
// }






// export const forgotPassword = async (req: Request, res: Response) => {
//    res.send('Password reset link sent')
// }

// export const resetPassword = async (req: Request, res: Response) => {
//    res.send('Password has been reset')
// }

// export const verifyToken = async (req: Request, res: Response) => {
//    res.send('Token verified')
// }  

// export const refreshToken = async (req: Request, res: Response) => {
//    res.send('Token refreshed')
// }

