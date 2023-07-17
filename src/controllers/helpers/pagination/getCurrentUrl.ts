import { Request } from 'express';

export const getCurrentUrl = (request: Request) =>
  new URL(`${request.protocol}://${request.get('host')}${request.originalUrl}`);
