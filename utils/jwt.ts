import { JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_SECRET } from "../config/env";
import jwt, { SignOptions } from "jsonwebtoken";

// ...existing code...
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

export const generateResetToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_SECRET as string, {
        expiresIn: '1h',
    });
}