import { Routes } from '@potentiel-applications/routes';
import { EnsureRole, RegisterAuth } from '../../modules/authN';
import { CreateUser, GetUserByEmail } from '../../modules/users';

import { makeAttachUserToRequestMiddleware } from './attachUserToRequestMiddleware';
import { getLogger } from '@potentiel-libraries/monitoring';
import { RequestHandler } from 'express';

export interface KeycloakAuthDeps {
  getUserByEmail: GetUserByEmail;
  createUser: CreateUser;
}

export const makeKeycloakAuth = (deps: KeycloakAuthDeps) => {
  const { getUserByEmail, createUser } = deps;

  const protectRoute: RequestHandler = async (req, res, next) => {
    if (req.user) {
      return next();
    }
    return res.redirect(Routes.Auth.signIn());
  };

  const ensureRole: EnsureRole = (roles) => {
    const roleList = Array.isArray(roles) ? roles : [roles];

    const logger = getLogger('KeycloakAuthLegacy');
    return (req, res, next) =>
      protectRoute(req, res, () => {
        if (!req.user) {
          logger.warn('no user found');
          res.status(403);
          res.end('Access denied');
        }
        if (!roleList.includes(req.user.role)) {
          logger.warn(`Role missing`, { user: req.user, roleList });
          res.status(403);
          res.end('Access denied');
        }
        return next();
      });
  };

  const registerAuth: RegisterAuth = ({ app }) => {
    app.use(
      makeAttachUserToRequestMiddleware({
        getUserByEmail,
        createUser,
      }),
    );
  };

  return {
    registerAuth,
    ensureRole,
  };
};
