import { STATUS_CODES } from 'node:http';

import {
  AggregateNotFoundError,
  DomainError,
  InvalidOperationError,
  OperationRejectedError,
} from '@potentiel-domain/core';

import { withErrorHandling } from './withErrorHandling';

export const apiAction = async (action: () => Promise<Response>) =>
  withErrorHandling(action, mapDomainError, mapTo401, mapTo400, mapTo500);

const mapDomainError = (e: DomainError) => {
  if (e instanceof InvalidOperationError) {
    return mapTo400(e);
  }
  if (e instanceof OperationRejectedError) {
    return mapTo403(e);
  }
  if (e instanceof AggregateNotFoundError) {
    return mapTo404(e);
  }

  return mapTo500();
};

const mapToHttpError = (status: number, message: string) =>
  Response.json(
    { message },
    {
      status,
      statusText: STATUS_CODES[status],
      headers: {
        'content-type': 'text/plain',
      },
    },
  );

const mapTo400 = (e: Error) => mapToHttpError(400, e.message);
const mapTo401 = () => mapToHttpError(401, "L'authentification a échoué");
const mapTo403 = (e: Error) =>
  mapToHttpError(403, e.message ? `Opération rejetée : ${e.message}` : `Opération rejetée`);
const mapTo404 = (e: Error) => mapToHttpError(404, e.message);
const mapTo500 = () => mapToHttpError(500, 'Une erreur est survenue');
