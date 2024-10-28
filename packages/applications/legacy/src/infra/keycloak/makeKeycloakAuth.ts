import makeSequelizeStore from 'connect-session-sequelize';
import session from 'express-session';
import Keycloak from 'keycloak-connect';
import QueryString from 'querystring';
import { User } from '../../entities';
import { EnsureRole, RegisterAuth } from '../../modules/authN';
import { CreateUser, GetUserByEmail } from '../../modules/users';
import routes from '../../routes';
import { makeAttachUserToRequestMiddleware } from './attachUserToRequestMiddleware';
import { miseAJourStatistiquesUtilisation } from '../../controllers/helpers';
import { isLocalEnv } from '../../config';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';

export interface KeycloakAuthDeps {
  sequelizeInstance: any;
  KEYCLOAK_SERVER: string | undefined;
  KEYCLOAK_REALM: string | undefined;
  KEYCLOAK_USER_CLIENT_ID: string | undefined;
  KEYCLOAK_USER_CLIENT_SECRET: string | undefined;
  NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME: string | undefined;
  getUserByEmail: GetUserByEmail;
  createUser: CreateUser;
}

export const makeKeycloakAuth = (deps: KeycloakAuthDeps) => {
  const {
    sequelizeInstance,
    KEYCLOAK_SERVER,
    KEYCLOAK_REALM,
    KEYCLOAK_USER_CLIENT_ID,
    KEYCLOAK_USER_CLIENT_SECRET,
    NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME,
    getUserByEmail,
    createUser,
  } = deps;

  if (
    !KEYCLOAK_SERVER ||
    !KEYCLOAK_REALM ||
    !KEYCLOAK_USER_CLIENT_ID ||
    !KEYCLOAK_USER_CLIENT_SECRET
  ) {
    console.error('Missing KEYCLOAK env vars');
    process.exit(1);
  }

  if (!NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME) {
    console.error('Missing NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME env var');
    process.exit(1);
  }
  const SequelizeStore = makeSequelizeStore(session.Store);

  const store = new SequelizeStore({
    db: sequelizeInstance,
    tableName: 'sessions',
    checkExpirationInterval: 15 * 60 * 1000, // 15 minutes
    expiration: 24 * 60 * 60 * 1000, // 1 day
  });

  const keycloak = new Keycloak(
    {
      store,
    },
    {
      'confidential-port': 0,
      'auth-server-url': KEYCLOAK_SERVER,
      resource: KEYCLOAK_USER_CLIENT_ID,
      'ssl-required': 'external',
      'bearer-only': false,
      realm: KEYCLOAK_REALM,
      // @ts-ignore
      credentials: {
        secret: KEYCLOAK_USER_CLIENT_SECRET,
      },
    },
  );

  const ensureRole: EnsureRole = (roles) => {
    const roleList = Array.isArray(roles) ? roles : [roles];

    return keycloak.protect((token) => {
      return roleList.some((role) => token.hasRealmRole(role));
    });
  };

  const registerAuth: RegisterAuth = ({ app, sessionSecret, router }) => {
    app.use(
      session({
        secret: sessionSecret,
        store,
        resave: false,
        proxy: true,
        saveUninitialized: false,
        ...(!isLocalEnv && {
          cookie: {
            secure: true,
          },
        }),
      }),
    );

    app.use(keycloak.middleware());

    app.use(
      makeAttachUserToRequestMiddleware({
        getUserByEmail,
        createUser,
      }),
    );

    router.get(routes.LOGIN, keycloak.protect(), (req, res) => {
      res.redirect(routes.REDIRECT_BASED_ON_ROLE);
    });

    router.get(routes.REDIRECT_BASED_ON_ROLE, keycloak.protect(), async (req, res) => {
      const user = req.user as User;

      if (!user) {
        // Sometimes, the user session is not immediately available in the req object
        // In that case, wait a bit and redirect to the same url

        // @ts-ignore
        if (req.kauth && Object.keys(req.kauth).length) {
          getLogger().error(new Error(`Got a valid auth token but no user associated !`), {
            token: req.kauth?.grant?.access_token?.content,
          });
          res.redirect(routes.LOGOUT_ACTION);
          return;
        }

        // Use a retry counter to avoid infinite loop
        const retryCount = Number(req.query.retry || 0);
        if (retryCount > 5) {
          // Too many retries
          return res.redirect('/');
        }
        setTimeout(() => {
          res.redirect(`${routes.REDIRECT_BASED_ON_ROLE}?retry=${retryCount + 1}`);
        }, 200);
        return;
      }

      miseAJourStatistiquesUtilisation({
        type: 'connexionUtilisateur',
        données: {
          utilisateur: {
            role: req.user.role,
          },
        },
      });

      // @ts-ignore
      const queryString = QueryString.stringify(req.query);

      /**
       * @todo Code à revoir quand on aura basculé toute l'app sur Next
       *
       * Le code ci-dessous fait les actiosn suivantes :
       * - Si j'ai un cookie qui a le nom de la variable d'env NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME, alors je suis déjà authentifié sur l'app next,
       * alors je retourne directement la liste des projets
       * - Sinon je m'authentifie déjà sur next, puis je suis redirigé sur la liste des projets
       *
       */
      const redirectTo =
        req.user.role === 'grd'
          ? Routes.Raccordement.importer
          : `${routes.LISTE_PROJETS}?${queryString}`;
      if (req.cookies[NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME]) {
        return res.redirect(redirectTo);
      }

      return res.redirect(`auth/signIn?callbackUrl=${redirectTo}`);
    });
  };

  return {
    registerAuth,
    ensureRole,
  };
};
