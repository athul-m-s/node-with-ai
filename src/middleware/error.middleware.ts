import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Always log the full error internally
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  // Never leak stack traces or internal messages in production
  const message =
    process.env.NODE_ENV === "production"
      ? statusCode === 500
        ? "Internal Server Error"
        : err.message
      : err.message || "Internal Server Error";

  res.status(statusCode).json({ message });
};
