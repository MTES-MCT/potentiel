export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: number,
  ) {
    super(message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string) {
    super(message, 400);
    this.name = BadRequestError.name;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message, 401);
    this.name = UnauthorizedError.name;
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string) {
    super(message, 403);
    this.name = ForbiddenError.name;
  }
}
