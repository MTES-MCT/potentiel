import { setDefaultOptions } from 'date-fns';
import * as LOCALE from 'date-fns/locale';
import dotenv from 'dotenv';
import express, { Request } from 'express';
import helmet from 'helmet';
import path, { join } from 'path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';
import { isLocalEnv, registerAuth } from './config';
import { v1Router } from './controllers';
import { logger } from './core/utils';
import { bootstrap } from '@potentiel-application/bootstrap';
import next from 'next';
import { registerSagas } from './sagas/registerSagas';
import { Log, Permission } from '@potentiel-libraries/mediateur-middlewares';

setDefaultOptions({ locale: LOCALE.fr });
dotenv.config();

const FILE_SIZE_LIMIT_MB = 50;

export async function makeServer(port: number, sessionSecret: string) {
  try {
    await registerSagas();

    const app = express();

    // Always first middleware
    app.use(Sentry.Handlers.requestHandler());

    if (!isLocalEnv) {
      app.use(
        helmet({
          // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
          // Only send refererer for same origin and transport (HTTPS->HTTPS)
          referrerPolicy: { policy: 'strict-origin' },
          hsts: {
            maxAge: 63072000,
            includeSubDomains: false,
            preload: true,
          },
          crossOriginEmbedderPolicy: false,
          contentSecurityPolicy: {
            useDefaults: false,
            directives: {
              'default-src': ["'self'", 'blob:', 'metabase.potentiel.beta.gouv.fr'],
              'connect-src': [
                "'self'",
                "'unsafe-inline'",
                'analytics.potentiel.beta.gouv.fr',
                'client.crisp.chat',
                'wss://client.relay.crisp.chat',
              ],
              'img-src': ["'self'", 'data:', 'client.crisp.chat', 'image.crisp.chat'],
              'font-src': ["'self'", 'data:', 'client.crisp.chat'],
              'style-src': ["'self'", 'data:', "'unsafe-inline'", 'client.crisp.chat'],
              'script-src': [
                "'unsafe-inline'",
                "'self'",
                'metabase.potentiel.beta.gouv.fr',
                'analytics.potentiel.beta.gouv.fr',
                'client.crisp.chat',
              ],
              'object-src': ["'none'"],
            },
          },
        }),
      );
    }

    app.use(
      morgan('tiny', {
        skip: (req: Request, res) =>
          req.path.startsWith('/fonts') ||
          req.path.startsWith('/css') ||
          req.path.startsWith('/images') ||
          req.path.startsWith('/scripts') ||
          req.path.startsWith('/main') ||
          req.path === '/',
      }),
    );

    app.use(cookieParser());

    app.use((req, res, next) => {
      // Cas permettant d'avoir l'authentification keycloak fonctionnelle
      // pour l'application next. À terme ce code disparaîtra une fois l'intégralité
      // de l'app custom framework legacy migrée dans l'application Next
      if (req.originalUrl.indexOf(`/api/auth/`) > -1) {
        next();
      } else {
        express.urlencoded({
          extended: false,
          limit: FILE_SIZE_LIMIT_MB + 'mb',
        })(req, res, next);
      }
    });
    app.use(express.json({ limit: FILE_SIZE_LIMIT_MB + 'mb' }));

    registerAuth({ app, sessionSecret, router: v1Router });

    app.use(v1Router);
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(Sentry.Handlers.errorHandler());

    app.use((error, req, res, next) => {
      logger.error(error);

      res
        .status(500)
        .send(
          'Une erreur inattendue est survenue. Veuillez nous excuser pour la gêne occasionée. Merci de réessayer et de contacter l‘équipe si le problème persiste.',
        );
    });

    /////// Custom server next
    const nextApp = next({
      dev: false,
      dir: join(__dirname, isLocalEnv ? '../' : '../..', 'packages', 'applications', 'ssr'),
    });

    const nextHandler = nextApp.getRequestHandler();

    app.get('*', (req, res) => {
      return nextHandler(req, res);
    });

    app.post('*', (req, res) => {
      return nextHandler(req, res);
    });

    await nextApp.prepare();

    await bootstrap({ middlewares: [Log.middleware, Permission.middleware] });
    app.listen(port, () => {
      process.env.start_datetime = new Date().getTime().toString();
      logger.info(`Server listening on port ${port}!`);
      logger.info(`APPLICATION_STAGE is ${process.env.APPLICATION_STAGE}`);
      logger.info(`Version ${process.env.npm_package_version}`);
    });
    ///////
  } catch (error) {
    logger.error(error);
  }
}

export * from './dataAccess';
