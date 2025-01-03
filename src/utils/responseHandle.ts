import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, message: string, statusCode: number = 200) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
  });
};

export const sendError = (res: Response, message: string, error: any = '', statusCode: number = 500) => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    error: error instanceof Error ? error.message : error,
  });
};
