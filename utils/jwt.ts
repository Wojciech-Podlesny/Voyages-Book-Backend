import { JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_SECRET } from "../config/env";
import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";

export const generateAccesToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_SECRET as string, {
        expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
    });
}

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_REFRESH_SECRET as string, {
        expiresIn: JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
    });
}


export const generateResetToken = (expiresInMinutes = 15) => {
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000)
    return { token, expiresAt }
}

export const generateVerifyEmailToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_SECRET as string, {
        expiresIn: '1d',
    });
}
