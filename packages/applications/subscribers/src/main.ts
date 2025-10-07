import { Pool } from 'pg';
import { Logger, runTaskList, Task } from 'graphile-worker';
import { match } from 'ts-pattern';
import { mediator } from 'mediateur';

import { getConnectionString } from '@potentiel-libraries/pg-helpers';
import { createLogger, getLogger, initLogger } from '@potentiel-libraries/monitoring';
import { Event, rebuild, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { récupérerGRDParVille } from '@potentiel-infrastructure/ore-client';
import { sendEmail } from '@potentiel-infrastructure/email';
import { logMiddleware } from '@potentiel-applications/bootstrap';

import { listSubscribers, runSubscriber } from './registry';
import { setupProjet } from './setupProjet';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace GraphileWorker {
    interface Tasks {
      handler: Event;
      rebuild: RebuildTriggered;
      error_notifications: { error_message: string };
    }
  }
}

const main = async () => {
  initLogger(
    createLogger({
      defaultMeta: { service: 'projectors' },
    }),
  );

  const pool = new Pool({
    connectionString: getConnectionString(),
    application_name: 'potentiel_subscribers',
    // TODO
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    // TODO
    // options: '-c search_path=auth',
  });

  const handler: Task<'handler'> = async (event, helpers) => {
    const [streamCategory, subscriberName] = helpers.job.task_identifier.split('|');
    await runSubscriber(streamCategory, subscriberName, event);
  };

  let nbRebuild = 0;
  const rebuildTriggered: Task<'rebuild'> = async (rebuildEvent) => {
    nbRebuild++;
    await rebuild(rebuildEvent, {
      eventType: 'all',
      eventHandler: async (event) => {
        await runSubscriber(rebuildEvent.payload.category, 'projector', event);
      },
    });
  };

  mediator.use({ middlewares: [logMiddleware] });

  await setupProjet({ récupérerGRDParVille, sendEmail });

  const subscribers = listSubscribers();

  const tasks = subscribers.reduce(
    (acc, subscriberKey) => {
      acc[subscriberKey] = handler;
      return acc;
    },
    {} as Record<string, Task<'handler'>>,
  );

  setInterval(() => {
    console.log({ nbRebuild });
  }, 5000).unref();

  await runTaskList(
    {
      concurrency: 20,
      pollInterval: 100000,
      logger: new Logger(({ jobId, label, taskIdentifier, workerId }) => {
        const meta = { jobId, label, taskIdentifier, workerId };
        return (level, message) =>
          match(level as 'debug' | 'info' | 'warning' | 'error')
            .with('debug', () => getLogger().debug(message, meta))
            .with('info', () => getLogger().info(message, meta))
            .with('warning', () => getLogger().warn(message, meta))
            .with('error', () => getLogger().error(message, meta))
            .exhaustive();
      }),
    },
    { ...tasks, rebuild: rebuildTriggered },
    // Incompatibilité avec @types/pg
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pool as any,
  );
};

void main();
