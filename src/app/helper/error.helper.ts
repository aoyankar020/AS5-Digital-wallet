export class AppError extends Error {
  public code: number;

  constructor(code: number, message: string, stack = "") {
    super(message);
    this.message = message;
    this.code = code;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
