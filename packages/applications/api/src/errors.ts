import { match, P } from 'ts-pattern';

import {
  AggregateNotFoundError,
  DomainError,
  InvalidOperationError,
  OperationRejectedError,
} from '@potentiel-domain/core';

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

const mapDomainErrorToApiError = (error: DomainError): ApiError => {
  const code = match(error)
    .with(P.instanceOf(InvalidOperationError), () => 400)
    .with(P.instanceOf(OperationRejectedError), () => 403)
    .with(P.instanceOf(AggregateNotFoundError), () => 404)
    .otherwise(() => 500);

  return new ApiError(error.message, code);
};

export const handleError = (error: unknown): { statusCode: number; message: string } => {
  if (error instanceof DomainError) {
    return handleError(mapDomainErrorToApiError(error));
  }

  if (error instanceof ApiError) {
    return { statusCode: error.code, message: error.message };
  }

  return { statusCode: 500, message: 'Internal Server Error' };
};
