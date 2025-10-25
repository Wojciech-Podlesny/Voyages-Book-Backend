import { Request, Response, NextFunction } from "express"
import bcrypt from "bcryptjs"
import jwt, { SignOptions } from "jsonwebtoken"
import {
  JWT_EXPIRES_IN,
  JWT_SECRET,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET,
} from "../config/env"
import prisma from "../database/prisma"
import { COOKIE_OPTIONS } from "../utils/cookies"
import { generateResetToken } from "../utils/jwt"
import { sendEmail } from "../services/emailService"


export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
   
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, refreshTokens: [], verified: false} as any,
    })

    const verifyEmail = `Click the link to verify your email: ${process.env.FRONTEND_URL}/verify-email/${verifyToken}`

    await sendEmail({
      from: `"Voyages Booking" <${process.env.SMTP_USER}>`,
      to: newUser.email,
      subject: "Verify your email",
      html: `<p>Thank you for signing up, ${newUser.name}!</p>
             <p>Please verify your email by clicking the link below:</p>
             <a href="${verifyEmail}">Verify Email</a>`,
    })

    const accessToken = jwt.sign(
      { userId: newUser.id },
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"] }
    )
    const refreshToken = jwt.sign(
      { userId: newUser.id },
      JWT_REFRESH_SECRET as string,
      { expiresIn: JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"] }
    )

    await prisma.user.update({
      where: { id: newUser.id },
      data: { refreshTokens: { push: refreshToken } },
    })

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        accessToken,
        user: { id: newUser.id, email: newUser.email, name: newUser.name },
      },
    })
  } catch (error) {
    next(error)
  }
}


export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: "Invalid email or password" })

    if (!user.verified) return res.status(403).json({ error: "Email not verified. Please verify your email to sign in." })

    const isPasswordValid = await bcrypt.compare(password, user.password)
  
  
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid email or password" })


    const accessToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"] }
    )
    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET as string,
      { expiresIn: JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"] }
    )


    await prisma.user.update({
      where: { id: user.id },
      data: { refreshTokens: { push: refreshToken } },
    })

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        accessToken,
        user: { id: user.id, email: user.email, name: user.name },
      },
    })
  } catch (error) {
    next(error)
  }
}

export const signOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken
    if (!token) {
      return res.status(400).json({ error: "Refresh token is required" })
    }

    try {
      const payload = jwt.verify(token, JWT_REFRESH_SECRET as string) as { userId: string }

      const user = await prisma.user.findUnique({ where: { id: payload.userId } })
      if (user) {
        const tokens = user.refreshTokens.filter((t: any) => t !== token)
        await prisma.user.update({
          where: { id: user.id },
          data: { refreshTokens: { set: tokens } },
        })
      }
    } catch {
      return res.status(401).json({ error: "Invalid refresh token" })
    }

    res.clearCookie("refreshToken", COOKIE_OPTIONS)

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    })
  } catch (error) {
    next(error)
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken
  if (!token) return res.status(401).json({ error: "No refresh token" })

  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET as string) as { userId: string }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user || !user.refreshTokens.includes(token)) {
      return res.status(401).json({ error: "Invalid refresh token" })
    }

    const newAccessToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"] }
    )
    const newRefreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET as string,
      { expiresIn: JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"] }
    )


    const tokens = user.refreshTokens.filter((t: any) => t !== token)
    tokens.push(newRefreshToken)

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshTokens: { set: tokens } },
    })

    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)

    return res.json({ accessToken: newAccessToken })
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" })
  }
}


export const verifyToken = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const payload = jwt.verify(token, JWT_SECRET as string) as { userId: string }
    return res.json({ valid: true, userId: payload.userId })
  } catch {
    return res.status(401).json({ valid: false })
  }
}


export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  const { currentPassword, newPassword } = req.body
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const payload = jwt.verify(token, JWT_SECRET as string) as { userId: string }
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return res.status(404).json({ error: "User not found" })

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) return res.status(401).json({ error: "Current password is incorrect" })

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, refreshTokens: { set: [] } },
    })

    res.clearCookie("refreshToken", COOKIE_OPTIONS)

    return res.json({ success: true, message: "Password changed successfully" })
  } catch (error) {
    next(error)
  }
}

export const requestResetPassword = async (req: Request, res: Response, next: NextFunction) => {
 
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User with this email does not exist" });
    }

    const resetToken = generateResetToken(user.id);
    

     await prisma.user.update({
      where: { id: user.id },
      data: { resetToken} as any,
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      from: `"Voyages Booking" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Password Reset",
      html:
        `<p>You requested a password reset. Click the link below to reset your password:</p>
          <p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 15 minutes.</p>`
    });

    res.json({ success: true, message: "Password reset token generated", resetToken });

} catch (error) {
    next(error);
  }
}


export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {token} = req.params;
    const { newPassword } = req.body;

    const user = await prisma.user.findFirst({
      where: { resetToken: token } as any 
    })

    if (!user) {
      return  res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword,10)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null } as any,
    })

    res.json({ success: true, message: "Password has been reset successfully" });    


  }  catch (error) {
    next(error);
  }

}


export const verifyEmail = async (req: Request, res: Response,
   next: NextFunction) => {
  try {
    const { token } = req.params;
    const payload = jwt.verify(token, JWT_SECRET as string) as { userId: string };

    await prisma.user.update({
      where: { id: payload.userId },
      data: { verified: true } as any,
    });


    res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired verification token" });
  }









}










// ------------
// import { Request, Response, NextFunction } from "express"
// import { AuthService } from "../services/authService"
// import { COOKIE_OPTIONS } from "../utils/cookies"
// import jwt from "jsonwebtoken"
// import { JWT_SECRET } from "../config/env"

// export const signUp = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { name, email, password } = req.body
//     const { newUser, accessToken, refreshToken } = await AuthService.signUp(name, email, password)

//     res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
//     res.status(201).json({
//       success: true,
//       message: "User created successfully",
//       data: { accessToken, user: { id: newUser.id, email, name } },
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// export const signIn = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { email, password } = req.body
//     const { user, accessToken, refreshToken } = await AuthService.signIn(email, password)

//     res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
//     res.status(200).json({
//       success: true,
//       message: "User logged in successfully",
//       data: { accessToken, user: { id: user.id, email, name: user.name } },
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// export const signOut = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const token = req.cookies?.refreshToken
//     if (!token) return res.status(400).json({ error: "Refresh token required" })

//     await AuthService.signOut(token)
//     res.clearCookie("refreshToken", COOKIE_OPTIONS)
//     res.json({ success: true, message: "User logged out successfully" })
//   } catch (error) {
//     next(error)
//   }
// }

// export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const token = req.cookies?.refreshToken
//     if (!token) return res.status(401).json({ error: "No refresh token" })

//     const { newAccessToken, newRefreshToken } = await AuthService.refreshToken(token)
//     res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
//     res.json({ accessToken: newAccessToken })
//   } catch (error) {
//     next(error)
//   }
// }

// export const verifyToken = async (req: Request, res: Response) => {
//   const authHeader = req.headers.authorization
//   if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "Missing token" })

//   const token = authHeader.split(" ")[1]
//   try {
//     const payload = await AuthService.verifyAccessToken(token)
//     res.json({ valid: true, userId: payload.userId })
//   } catch {
//     res.status(401).json({ valid: false })
//   }
// }

// export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { currentPassword, newPassword } = req.body
//     const token = req.headers.authorization?.split(" ")[1]
//     if (!token) return res.status(401).json({ error: "Missing token" })

//     const payload = jwt.verify(token, JWT_SECRET as string) as { userId: string }
//     await AuthService.changePassword(payload.userId, currentPassword, newPassword)

//     res.clearCookie("refreshToken", COOKIE_OPTIONS)
//     res.json({ success: true, message: "Password changed successfully" })
//   } catch (error) {
//     next(error)
//   }
// }
