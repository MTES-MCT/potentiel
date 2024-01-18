import {
  DomainError,
  InvalidOperationError,
  NotFoundError,
  OperationRejectedError,
} from '@potentiel-domain/core';

import { withErrorHandling } from './withErrorHandling';

export const apiAction = async (action: () => Promise<Response>) =>
  withErrorHandling(action, mapDomainError, mapTo500);

const mapDomainError = (e: DomainError) => {
  if (e instanceof InvalidOperationError) {
    return mapTo400(e);
  }
  if (e instanceof OperationRejectedError) {
    return mapTo401();
  }
  if (e instanceof NotFoundError) {
    return mapTo404(e);
  }

  return mapTo500();
};

const mapTo404 = (e: Error) => {
  return Response.json(
    {
      message: e.message,
    },
    {
      status: 404,
      statusText: 'Not Found',
      headers: {
        'content-type': 'text/plain',
      },
    },
  );
};

const mapTo400 = (e: Error) => {
  return Response.json(
    {
      message: e.message,
    },
    {
      status: 400,
      statusText: 'Bad Request',
    },
  );
};

const mapTo401 = () => {
  return Response.json(
    {
      message: 'Opération rejetée',
    },
    {
      status: 401,
      statusText: 'Unauthorized',
      headers: {
        'content-type': 'text/plain',
      },
    },
  );
};

const mapTo500 = () => {
  return Response.json(
    {
      message: 'Une erreur est survenue',
    },
    {
      status: 500,
      statusText: 'Internal Server Error',
      headers: {
        'content-type': 'text/plain',
      },
    },
  );
};
