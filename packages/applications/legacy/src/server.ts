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
import { FILE_SIZE_LIMIT_IN_MB, v1Router } from './controllers';
import { logger } from './core/utils';
import next from 'next';
import { registerSagas } from './sagas/registerSagas';
import { readFile } from 'node:fs/promises';
import { permissionMiddleware } from '@potentiel-domain/utilisateur';
import { bootstrap } from '@potentiel-applications/bootstrap';
import crypto from 'node:crypto';
import { MulterError } from 'multer';

setDefaultOptions({ locale: LOCALE.fr });
dotenv.config();

export async function makeServer(port: number, sessionSecret: string) {
  try {
    await registerSagas();

    const app = express();

    // Always first middleware
    app.use(Sentry.Handlers.requestHandler());

    if (!isLocalEnv) {
      // generate a unique nonce per request, to use in the CSP header and in every <script> in the markup
      app.use((req, _, next) => {
        const nonce = crypto.randomBytes(32).toString('hex');
        req.headers['x-nonce'] = nonce;
        // This is a hack to make the nonce available NextJS, which checks the request header to get the nonce
        req.headers['content-security-policy'] = `script-src: 'nonce-${nonce}'`;
        next();
      });
      app.use(
        helmet({
          // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
          // Only send refererer for same origin and transport (HTTPS->HTTPS)
          referrerPolicy: { policy: 'strict-origin' },
          // This is already handled by Scalingo, and overriding it results in an invalid value
          hsts: false,
          crossOriginEmbedderPolicy: false,
          contentSecurityPolicy: {
            useDefaults: false,
            directives: {
              'default-src': ["'self'", 'blob:', 'metabase.potentiel.beta.gouv.fr'],
              'connect-src': [
                "'self'",
                'potentiel.beta.gouv.fr',
                'client.crisp.chat',
                'wss://client.relay.crisp.chat',
              ],
              'font-src': ["'self'", 'client.crisp.chat'],
              'frame-src': ['metabase.potentiel.beta.gouv.fr', 'blob:'],
              'img-src': ["'self'", 'data:', 'image.crisp.chat'],
              'style-src': ["'self'", "'unsafe-inline'", 'data:', 'client.crisp.chat'],
              'script-src': [
                "'self'",
                // every inline <script> must have this nonce, or will be forbidden to run
                (req) => `'nonce-${req.headers['x-nonce']}'`,
                // whitelist the react-dsfr script. This may change in future versions of react-dsfr.
                // an alternative solution can be found here: https://react-dsfr.codegouv.studio/content-security-policy
                "'sha256-UEZfoO3SfsYbnIIAoHHUiIGOhT+nhTDv2gd4I5588HQ='",
                'metabase.potentiel.beta.gouv.fr',
                'client.crisp.chat',
              ],
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
          limit: FILE_SIZE_LIMIT_IN_MB + 'mb',
        })(req, res, next);
      }
    });

    app.use(express.json({ limit: FILE_SIZE_LIMIT_IN_MB + 'mb' }));

    registerAuth({ app });

    app.use(v1Router);
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(Sentry.Handlers.errorHandler());

    app.use((error, req, res, next) => {
      logger.error(error);

      if (error instanceof MulterError && error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).send(`Le fichier ne doit pas dépasser ${FILE_SIZE_LIMIT_IN_MB} Mo`);
      }

      return res
        .status(500)
        .send(
          'Une erreur inattendue est survenue. Veuillez nous excuser pour la gêne occasionnée. Merci de réessayer et de contacter l‘équipe si le problème persiste.',
        );
    });

    /////// Custom server next
    const isDebug = !__dirname.includes('dist');
    const nextApp = next({
      dev: false,
      dir: join(__dirname, isDebug ? join('..', '..') : join('..', '..', '..'), 'ssr'),
    });

    const nextHandler = nextApp.getRequestHandler();

    app.get('*', (req, res) => {
      return nextHandler(req, res);
    });

    app.post('*', (req, res) => {
      return nextHandler(req, res);
    });

    await nextApp.prepare();

    await bootstrap({ middlewares: [permissionMiddleware] });

    if (!process.env.MAINTENANCE_MODE) {
      app.listen(port, () => {
        process.env.start_datetime = new Date().getTime().toString();
        logger.info(`Server listening on port ${port}!`);
        logger.info(`APPLICATION_STAGE is ${process.env.APPLICATION_STAGE}`);
        logger.info(`Version ${process.env.npm_package_version}`);
      });
    } else {
      const maintenanceHTML = await readFile(join(__dirname, 'views', 'maintenance.html'), {
        encoding: 'utf-8',
      });
      const maintenanceApp = express();
      maintenanceApp.use(express.static(path.join(__dirname, 'public')));
      maintenanceApp.get('*', (req, res) => {
        res.send(maintenanceHTML);
      });

      maintenanceApp.listen(port, () => {
        process.env.start_datetime = new Date().getTime().toString();
        logger.info(`Server listening on port ${port}!`);
        logger.info(`APPLICATION_STAGE is ${process.env.APPLICATION_STAGE}`);
        logger.info(`Version ${process.env.npm_package_version}`);
        logger.info(`Maintenance mode enabled`);
      });
    }
    ///////
  } catch (error) {
    logger.error(error);
  }
}

export * from './dataAccess';
