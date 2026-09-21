export class AppError extends Error {
  public statusCode: number;
  public errorCode: string;
  public details?: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    statusCode: number,
    errorCode: string,
    details?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
