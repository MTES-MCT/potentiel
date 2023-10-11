import { setDefaultOptions } from 'date-fns';
import * as LOCALE from 'date-fns/locale';
import dotenv from 'dotenv';
import express, { Request } from 'express';
import helmet from 'helmet';
import path from 'path';
import morgan from 'morgan';
import * as Sentry from '@sentry/node';
import { isDevEnv, registerAuth } from './config';
import { v1Router } from './controllers';
import { logger } from './core/utils';
import { bootstrap as bootstrapWebApp } from '@potentiel/web';
import { subscribe } from '@potentiel/pg-event-sourcing';
import { DateMiseEnServiceTransmise } from './modules/project';
import { transformerISOStringEnDate } from './infra/helpers';
import { publishToEventBus } from './config/eventBus.config';

setDefaultOptions({ locale: LOCALE.fr });
dotenv.config();

const FILE_SIZE_LIMIT_MB = 50;

export async function makeServer(port: number, sessionSecret: string) {
  try {
    await bootstrapWebApp();
    // TODO : activer le bootstrap de l'application de notifications quand un cas sera implémenter
    // await bootstrapNotifcationApp();

    // TODO : Subscribe à supprimer et saga à reimplémenter côté nouveau socle
    // lorsque la notion de projet sera dispo en tant qu'aggregate dans le package domain
    await subscribe({
      name: 'saga-application-delais-dix-huit-mois',
      eventType: ['DateMiseEnServiceTransmise-V1'],
      eventHandler: (event) => {
        return new Promise<void>((resolve) => {
          logger.info('Executing saga-application-delais-dix-huit-mois');
          if (event.type === 'DateMiseEnServiceTransmise-V1') {
            publishToEventBus(
              new DateMiseEnServiceTransmise({
                payload: {
                  ...transformerISOStringEnDate(event.payload),
                  streamId: event.stream_id,
                },
              }),
            ).map(() => {
              resolve();
            });
          }
          resolve();
        });
      },
      streamCategory: 'raccordement',
    });

    const app = express();

    // Always first middleware
    app.use(Sentry.Handlers.requestHandler());

    if (!isDevEnv) {
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

    app.use(
      express.urlencoded({
        extended: false,
        limit: FILE_SIZE_LIMIT_MB + 'mb',
      }),
    );
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

    return new Promise((resolve) => {
      const server = app.listen(port, () => {
        process.env.start_datetime = new Date().getTime().toString();
        logger.info(`Server listening on port ${port}!`);
        logger.info(`APPLICATION_STAGE is ${process.env.APPLICATION_STAGE}`);
        logger.info(`Version ${process.env.npm_package_version}`);
        resolve(server);
      });
    });
  } catch (error) {
    logger.error(error);
  }
}

export * from './dataAccess';
