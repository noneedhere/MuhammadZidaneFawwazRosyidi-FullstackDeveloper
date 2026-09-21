import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  data: any,
  message: string = 'Success',
  statusCode: number = 200
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string,
  errorCode: string,
  statusCode: number = 400,
  details?: Array<{ field: string; message: string }>
) => {
  const response: any = {
    success: false,
    message,
    error: errorCode,
  };
  if (details) {
    response.details = details;
  }
  res.status(statusCode).json(response);
};
