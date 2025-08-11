import { Request, Response } from 'express';
import { NODE_ENV } from '@config/env';
import { HttpException } from '@exceptions/httpException';
import { logger } from '@utils/logger';

export const ErrorMiddleware = (error: HttpException, req: Request, res: Response) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  logger.error(`[${req.method}] ${req.originalUrl} | Status: ${status} | Message: ${message}`);

  res.status(status).json({
    success: false,
    error: {
      code: status,
      message,
      ...(NODE_ENV === 'development' && error.stack ? { stack: error.stack } : {}),
      ...(typeof error.data === 'object' && error.data !== null ? { data: error.data } : {}),
    },
  });
};
