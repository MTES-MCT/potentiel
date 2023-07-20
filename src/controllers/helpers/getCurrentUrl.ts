import { Request } from 'express';

export const getCurrentUrl = (request: Request) =>
  `${request.protocol}://${request.get('host')}${request.originalUrl}`;
