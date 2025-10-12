import { Response } from "express";
export type AppResponse<T, TError> = {
  res: Response;
  statusCode: number;
  data: T;
  error?: TError;
};
export const SuccessResponse = <T>({
  res,
  data,
  statusCode,
}: AppResponse<T, {}>) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    data,
  });
};

export const ErrorResponse = <T, TError>({
  res,
  data,
  statusCode,
  error,
}: AppResponse<T, TError>) => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    data,
    ...(error && { error }),
  });
};
