import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export type TNextError = {
  message: string;
  status: StatusCodes;
};

export function errorHandler(
  err: TNextError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(err.status || 500).json({ error: 'Internal server error' });
}

export function customNext(next: NextFunction, arg?: TNextError) {
  if (arg && Object.keys(arg).length) {
    const { message, status } = arg;
    return next({
      message,
      status,
    });
  }

  return next();
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: 'Not found' });
}
