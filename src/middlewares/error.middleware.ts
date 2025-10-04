import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


const errorMiddleware = async (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error middleware caught an error:", err);

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = 400;
      message = `Duplicate field value: ${err.meta?.target}`;
    }

    if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Resource not found';
    }

  }

  if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message
  }

  res.status(statusCode).json({
    success: false,
    message
  })

};

export default errorMiddleware;
