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



const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 dni
}

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, refreshTokens: [] },
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
