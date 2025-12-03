import { match, P } from 'ts-pattern';
// eslint-disable-next-line no-restricted-imports

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
  constructor(
    message: string,
    public readonly errors?: unknown,
  ) {
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

export const handleError = (
  error: unknown,
): { statusCode: number; message: string; body?: Record<string, unknown> } => {
  if (error instanceof DomainError) {
    return handleError(mapDomainErrorToApiError(error));
  }

  if (error instanceof ApiError) {
    const result = { statusCode: error.code, message: error.message };
    if (error instanceof BadRequestError) {
      return { ...result, body: { errors: error.errors } };
    }
    return result;
  }

  return { statusCode: 500, message: 'Internal Server Error' };
};
