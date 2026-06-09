import { Args, Command } from '@oclif/core';
import { mediator } from 'mediateur';

import { setupSubscribers } from '@potentiel-applications/subscribers';
import type { DomainEvent } from '@potentiel-domain/core';
import type {
  RebuildAllTriggered,
  RebuildOneTriggered,
} from '@potentiel-infrastructure/pg-event-sourcing';
import { rebuild, rebuildAll } from '@potentiel-infrastructure/pg-event-sourcing';
import { getLogger } from '@potentiel-libraries/monitoring';

import { dbSchema } from '#helpers';

export class RebuildProjectionCommand extends Command {
  static summary = 'Reconstruit une projection ou un stream, sans passer les notifiers DB.';
  static description =
    `Le rebuild est effectué dans le processus de la CLI, et non dans le container des subscribers.\n
    Le parallélisme peut être controlé via la variable d'env REBUILD_CONCURRENCY.`;

  static args = {
    categoryOuStreamId: Args.string({
      description: 'nom de la catégorie ou du stream à rejouer (format: catégorie|streamId)',
      required: true,
    }),
  };

  async init() {
    dbSchema.parse(process.env);
  }

  async run() {
    const { args } = await this.parse(RebuildProjectionCommand);
    const { categoryOuStreamId } = args;
    const [category, parsedStreamId] = categoryOuStreamId.split('|');
    const streamId = parsedStreamId?.trim() || undefined;

    if (!category) {
      this.error('La catégorie est obligatoire');
    }

    const logger = getLogger('projection-rebuild');

    const subscriptions = setupSubscribers({})
      .listSubscriptions()
      .filter((x) => x.streamCategory === category && ['projector', 'history'].includes(x.name))
      .sort((a, b) => a.name.localeCompare(b.name))
      .reverse();

    if (!subscriptions.length) {
      this.error(`Aucun subscriber trouvé pour la catégorie ${category}`);
    }

    for (const subscription of subscriptions) {
      logger.info('Starting inline rebuild', {
        category,
        streamId,
        subscription,
        mode: streamId ? 'single-stream' : 'category',
      });

      // only used for a single stream, to throw when the stream is not found.
      // start at -1 to ignore the RebuildTriggered event.
      let count = -1;

      const subscriber = {
        eventHandler: async (event: DomainEvent) => {
          count++;
          await mediator.send({
            type: subscription.messageType,
            data: event,
          });
        },
        eventType: 'all',
        name: subscription.name,
        streamCategory: category,
      };

      if (streamId) {
        const rebuildOneEvent: RebuildOneTriggered = {
          stream_id: `${category}|${streamId}`,
          created_at: new Date().toISOString(),
          version: 0,
          type: 'RebuildTriggered',
          payload: {
            category,
            id: streamId,
          },
        };
        await rebuild(rebuildOneEvent, subscriber);

        if (count > 0) {
          logger.info('Stream rebuilt');
          return;
        }
        logger.warn('Stream not found...');
        this.exit(1);
      }

      logger.info('Triggering rebuild for subscription', {
        category,
        streamId,
      });

      const rebuildAllEvent: RebuildAllTriggered = {
        stream_id: category,
        created_at: new Date().toISOString(),
        version: 0,
        type: 'RebuildTriggered',
        payload: {
          category,
        },
      };
      await rebuildAll(rebuildAllEvent, subscriber);
    }
  }
}
