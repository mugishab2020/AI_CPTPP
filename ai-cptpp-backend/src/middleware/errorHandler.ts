import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  error: string;
  message?: string;
  stack?: string;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err.stack);

  const isDevelopment = process.env.NODE_ENV === 'development';

  const errorResponse: ErrorResponse = {
    error: 'Internal Server Error',
  };

  if (isDevelopment) {
    errorResponse.message = err.message;
    errorResponse.stack = err.stack;
  }

  res.status(500).json(errorResponse);
};