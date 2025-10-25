import bcrypt from "bcryptjs"
import jwt, { SignOptions } from "jsonwebtoken"
import prisma from "../database/prisma"
import {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} from "../config/env"
import { generateResetToken, generateVerifyEmailToken } from "../utils/jwt"
import { sendEmail } from "./emailService"


export const signUpService = async (name: string, email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) throw new Error("User with this email already exists")

  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword, verified: false, refreshTokens: [] },
  })

  const verifyToken = generateVerifyEmailToken(newUser.id)
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verifyToken}`

  await sendEmail({
    from: `"Voyages Booking" <${process.env.SMTP_USER}>`,
    to: newUser.email,
    subject: "Verify your email",
    html: `<p>Thank you for signing up, ${newUser.name}!</p>
           <p>Please verify your email by clicking the link below:</p>
           <a href="${verifyUrl}">Verify Email</a>`,
  })

  const accessToken = jwt.sign({ userId: newUser.id }, JWT_SECRET as string, {
    expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
  })
  const refreshToken = jwt.sign({ userId: newUser.id }, JWT_REFRESH_SECRET as string, {
    expiresIn: JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  })

  await prisma.user.update({
    where: { id: newUser.id },
    data: { refreshTokens: { push: refreshToken } },
  })

  return { accessToken, refreshToken, newUser }
}


export const signInService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error("Invalid email or password")
  if (!user.verified) throw new Error("Email not verified")

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw new Error("Invalid email or password")

  const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET as string, {
    expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
  })
  const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET as string, {
    expiresIn: JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  })

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshTokens: { push: refreshToken } },
  })

  return { accessToken, refreshToken, user }
}

export const signOutService = async (token: string) => {
  const payload = jwt.verify(token, JWT_REFRESH_SECRET as string) as { userId: string }
  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user) return

  const tokens = user.refreshTokens.filter((t: string) => t !== token)
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshTokens: { set: tokens } },
  })
}


export const refreshTokenService = async (oldToken: string) => {
  const payload = jwt.verify(oldToken, JWT_REFRESH_SECRET as string) as { userId: string }
  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user || !user.refreshTokens.includes(oldToken)) throw new Error("Invalid token")

  const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET as string, {
    expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
  })
  const newRefresh = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET as string, {
    expiresIn: JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  })

  const tokens = [...user.refreshTokens.filter((t) => t !== oldToken), newRefresh]
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshTokens: { set: tokens } },
  })

  return { accessToken, refreshToken: newRefresh }
}


export const changePasswordService = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error("User not found")

  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid) throw new Error("Current password is incorrect")

  const hashed = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, refreshTokens: { set: [] } },
  })
}

export const requestResetPasswordService = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error("User with this email does not exist")

  const { token, expiresAt } = generateResetToken()
  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpiry: expiresAt },
  })

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`
  await sendEmail({
    from: `"Voyages Booking" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: "Password Reset",
    html: `<p>You requested a password reset.</p><a href="${resetUrl}">Reset Password</a>`,
  })
}

export const resetPasswordService = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
  })
  if (!user) throw new Error("Invalid or expired reset token")

  const hashed = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, resetToken: null, resetTokenExpiry: null },
  })
}


export const verifyEmailService = async (token: string) => {
  const payload = jwt.verify(token, JWT_SECRET as string) as { userId: string }
  await prisma.user.update({
    where: { id: payload.userId },
    data: { verified: true },
  })
}

export const verifyTokenService = (token: string) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET as string) as { userId: string }
    return { valid: true, userId: payload.userId }
  } catch {
    return { valid: false }
  }
}
