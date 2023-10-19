import { InvalidOperationError, NotFoundError } from '@potentiel-domain/core';

export const executeAction = async (action: () => Promise<Response>) => {
  try {
    return await action();
  } catch (e) {
    if (e instanceof InvalidOperationError) {
      return mapTo400(e);
    }

    if (e instanceof NotFoundError) {
      return mapTo404(e);
    }

    return mapTo500(e as Error);
  }
};

const mapTo404 = (e: Error) => {
  return new Response(null, {
    status: 404,
    statusText: 'Not Found',
    headers: {
      'content-type': 'text/plain',
    },
  });
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

const mapTo500 = (e: Error) => {
  return new Response(null, {
    status: 500,
    statusText: 'Internal Server Error',
    headers: {
      'content-type': 'text/plain',
    },
  });
};
