import { Request, Response, NextFunction } from 'express';
import routes from '@routes';

export const maintenanceMiddleware = (request: Request, response: Response, next: NextFunction) => {
  if (process.env.MAINTENANCE_DATE && new Date().getTime() < Number(process.env.MAINTENANCE_DATE)) {
    return response.redirect(routes.GET_MAINTENANCE_PAGE);
  }

  return next();
};
