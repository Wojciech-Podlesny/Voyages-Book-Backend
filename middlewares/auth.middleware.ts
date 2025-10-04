import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/env"
import { Request, Response, NextFunction} from "express"
import prisma from "../database/prisma"
import { User } from "@prisma/client";


declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

const authorize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }

        if(!token) return res.status(401).json({message: 'Unauthorized'})

        const decoded = jwt.verify(token, JWT_SECRET as string) as {userId: string};

        const user = await prisma.user.findUnique({where: { id: (decoded.userId) }})

        if(!user) return res.status(401).json({message: 'Unauthorized'});

        req.user = user

        next()

    } catch(error) {
        res.status(401).json({message: 'Unauthorized', error: (error as Error).message})
    }
}

export default authorize