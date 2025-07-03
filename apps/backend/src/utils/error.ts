export class APIError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    //----------- for stack trace ------------
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string) {
    return new APIError(400, message);
  }

  static internal(message: string) {
    return new APIError(500, message);
  }

  static notFound(message: string) {
    return new APIError(404, message);
  }

  static unauthorized(message: string) {
    return new APIError(401, message);
  }

  static forbidden(message: string) {
    return new APIError(403, message);
  }

  static conflict(message: string) {
    return new APIError(409, message);
  }
}
