import { setDefaultOptions } from 'date-fns';
import * as LOCALE from 'date-fns/locale';
import dotenv from 'dotenv';
import express, { Request } from 'express';
import helmet from 'helmet';
import path, { join } from 'path';
import morgan from 'morgan';
import * as Sentry from '@sentry/node';
import { isLocalEnv, registerAuth } from './config';
import { v1Router } from './controllers';
import { logger } from './core/utils';
import next from 'next';
import { registerSagas } from './sagas/registerSagas';
import { readFile } from 'node:fs/promises';
import { bootstrap, logMiddleware, permissionMiddleware } from '@potentiel-applications/bootstrap';
import crypto from 'node:crypto';
import { runWebWithContext } from '@potentiel-applications/request-context';
import { setupLogger } from './setupLogger';
import { executeSubscribersRetry } from '@potentiel-infrastructure/pg-event-sourcing';

setDefaultOptions({ locale: LOCALE.fr });
dotenv.config();

export async function makeServer(port: number) {
  try {
    setupLogger();

    const app = express();

    // This handles the authentication
    app.use((req, res, next) => runWebWithContext({ app: 'legacy', req, res, callback: next }));

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
                process.env.NEXT_PUBLIC_GEO_API_URL
                  ? new URL(process.env.NEXT_PUBLIC_GEO_API_URL).hostname
                  : '',
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

    app.use((req, res, next) => {
      // Cas permettant d'avoir l'authentification keycloak fonctionnelle
      // pour l'application next. À terme ce code disparaîtra une fois l'intégralité
      // de l'app custom framework legacy migrée dans l'application Next
      if (req.originalUrl.indexOf(`/api/auth/`) > -1) {
        next();
      } else {
        express.urlencoded({
          extended: false,
        })(req, res, next);
      }
    });

    registerAuth({ app });

    app.use(v1Router);
    app.use(express.static(path.join(__dirname, 'public')));

    Sentry.setupExpressErrorHandler(app);

    app.use((error, req, res, next) => {
      logger.error(error);

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

    await bootstrap({ middlewares: [logMiddleware, permissionMiddleware] });
    await registerSagas();
    await executeSubscribersRetry();

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
