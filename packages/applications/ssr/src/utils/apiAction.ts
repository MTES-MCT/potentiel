import { getLogger } from '@potentiel/monitoring';
import {
  InvalidOperationError,
  NotFoundError,
  OperationRejectedError,
} from '@potentiel-domain/core';

export const apiAction = async (action: () => Promise<Response>) => {
  try {
    return await action();
  } catch (e) {
    if (e instanceof InvalidOperationError) {
      return mapTo400(e);
    }

    if (e instanceof OperationRejectedError) {
      return mapTo401(e);
    }

    if (e instanceof NotFoundError) {
      return mapTo404(e);
    }

    return mapTo500(e as Error);
  }
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

const mapTo401 = (e: Error) => {
  getLogger().warn(e.message);
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

const mapTo500 = (e: Error) => {
  getLogger().error(e);
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
