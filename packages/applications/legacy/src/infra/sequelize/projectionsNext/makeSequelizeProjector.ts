import { Model, ModelStatic, QueryTypes, Transaction } from 'sequelize';
import { DomainEvent } from '../../../core/domain';
import { sequelizeInstance } from '../../../sequelize.config';
import { Projector } from './projector';
import { EventHandler } from './eventHandler';
import * as readline from 'readline';
import { fromPersistance } from '../helpers';
import { logger } from '../../../core/utils';

/**
 * @deprecated use createProjectorFactory instead (this one has a coupling with sequelizeInstance configuration)
 */
export const makeSequelizeProjector = <TModel extends ModelStatic<Model>>(
  model: TModel,
): Projector => {
  const name = model.tableName;
  const handlersByType: Record<string, EventHandler<any>> = {};

  const handleEvent = async <Event extends DomainEvent>(
    event: Event,
    transaction?: Transaction,
  ) => {
    const { type } = event;
    if (handlersByType[type]) {
      await handlersByType[type](event, transaction);
    }
  };

  return {
    name,
    on: (eventClass, handler) => {
      const type = eventClass.name;

      if (handlersByType[type]) {
        throw new Error(`The event ${type} already has an handler for the projection ${name}`);
      }

      handlersByType[type] = handler;
      return handler;
    },
    initialize: (subscribe) => {
      subscribe(async (event) => {
        await handleEvent(event);
      }, name);
      logger.info(`Projector initialized: ${name}`);
    },
    rebuild: async (transaction) => {
      await model.destroy({ truncate: true, transaction });
      try {
        const events = await sequelizeInstance.query(
          `SELECT * FROM "eventStores" 
         WHERE type in (${Object.keys(handlersByType)
           .map((event) => `'${event}'`)
           .join(',')}) 
         ORDER BY "occurredAt" ASC`,
          {
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
      } catch (error) {
        console.error(error);
      }
    },
  };
};

const printProgress = (progress) => {
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(progress);
};
