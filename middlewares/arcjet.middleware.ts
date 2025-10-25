import { Request, Response, NextFunction } from 'express';

const arcjetMiddleware =  async () => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log(`Arcjet Middleware: ${req.method} ${req.url}`);
        next();
    }
}

export default arcjetMiddleware;