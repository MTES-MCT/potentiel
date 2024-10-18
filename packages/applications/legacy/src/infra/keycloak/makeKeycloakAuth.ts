import QueryString from 'querystring';
import { EnsureRole, RegisterAuth } from '../../modules/authN';
import { CreateUser, GetUserByEmail } from '../../modules/users';
import routes from '../../routes';
import { makeAttachUserToRequestMiddleware } from './attachUserToRequestMiddleware';
import { miseAJourStatistiquesUtilisation } from '../../controllers/helpers';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { RequestHandler } from 'express';
import { decode } from 'next-auth/jwt';

export interface KeycloakAuthDeps {
  NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME: string | undefined;
  getUserByEmail: GetUserByEmail;
  createUser: CreateUser;
}

export const makeKeycloakAuth = (deps: KeycloakAuthDeps) => {
  const { NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME, getUserByEmail, createUser } = deps;

  if (!NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME) {
    console.error('Missing NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME env var');
    process.exit(1);
  }

  const loadToken: RequestHandler = async (req, _, next) => {
    const cookie = req.cookies[NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME];
    if (cookie) {
      const token = await decode({
        token: cookie,
        secret: process.env.NEXTAUTH_SECRET ?? '',
      });
      if (token) {
        req.token = token;
      } else {
        console.log('could not decode token from cookie');
      }
    }
    next();
  };

  const protectRoute: RequestHandler = async (req, res, next) => {
    if (req.user) {
      return next();
    }
    const params = new URLSearchParams({ callbackUrl: req.path });
    return res.redirect(`auth/signIn?${params}`);
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

  const registerAuth: RegisterAuth = ({ app, router }) => {
    app.use(loadToken);

    app.use(
      makeAttachUserToRequestMiddleware({
        getUserByEmail,
        createUser,
      }),
    );

    router.get(routes.REDIRECT_BASED_ON_ROLE, protectRoute, async (req, res) => {
      miseAJourStatistiquesUtilisation({
        type: 'connexionUtilisateur',
        données: {
          utilisateur: {
            role: req.user.role,
          },
        },
      });

      // @ts-ignore
      const queryString = new QueryString.stringify(req.query);
      const redirectTo =
        req.user.role === 'grd'
          ? Routes.Raccordement.lister
          : `${routes.LISTE_PROJETS}?${queryString}`;
      return res.redirect(redirectTo);
    });
  };

  return {
    registerAuth,
    ensureRole,
  };
};
