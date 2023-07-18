import { Request } from 'express';

export const getCurrentUrl = (request: Request) => {
  console.log(
    new URL(`${request.protocol}://${request.get('host')}${request.originalUrl}`).toString(),
  );
  return new URL(`${request.protocol}://${request.get('host')}${request.originalUrl}`).toString();
};
