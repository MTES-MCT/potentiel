import { QueryTypes, Sequelize, Transaction } from 'sequelize';
import { DomainEvent } from '@core/domain';
import { ProjectorFactory } from './projector';
import { EventHandler } from './eventHandler';
import * as readline from 'readline';
import { fromPersistance } from '../helpers';
import { logger } from '@core/utils';
import { ProjectionEnEchec } from '@modules/shared';

export const createProjectorFactory =
  (sequelize: Sequelize): ProjectorFactory =>
  (model) => {
    const name = model.tableName;
    const handlers: Map<string, EventHandler<any>> = new Map();

    const handleEvent = async <Event extends DomainEvent>(
      event: Event,
      transaction?: Transaction,
    ) => {
      const { type } = event;
      if (handlers.has(type)) {
        const handler = handlers.get(type);
        try {
          await handler!(event, transaction);
        } catch (error) {
          logger.error(
            new ProjectionEnEchec(
              `Erreur lors du traitement de l'événement ${type}`,
              {
                évènement: event,
                nomProjection: `${name}.${handler?.name}`,
              },
              error,
            ),
          );
        }
      }
    };

    return {
      name,
      on: (eventClass, handler) => {
        const type = eventClass.name;

        if (handlers.has(type)) {
          throw new Error(`The event ${type} already has an handler for the projection ${name}`);
        }

        handlers.set(type, handler);
        return handler;
      },
      initialize: (subscribe) => {
        subscribe(async (event) => {
          await handleEvent(event);
        }, name);
        logger.info(`Projector initialized: ${name}`);
      },
      rebuild: async (transaction) => {
        try {
          await model.destroy({ truncate: true, transaction });
          const eventTypes = [...handlers.keys()];

          const events = await sequelize.query(
            'SELECT * FROM "eventStores" WHERE type IN (:eventTypes) ORDER BY "occurredAt" ASC',
            {
              replacements: { eventTypes },
              type: QueryTypes.SELECT,
              transaction,
            },
          );

          const total = events.length;
          for (const [index, event] of events.entries()) {
            printProgress(`${index + 1}/${total}`);
            const eventToHandle = fromPersistance(event);
            eventToHandle && (await handleEvent(eventToHandle, transaction));
          }
        } catch (e) {
          console.error(e);
        }
      },
    };
  };

const printProgress = (progress) => {
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(progress);
};
