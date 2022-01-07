import { Model, ModelCtor, QueryTypes, Transaction } from 'sequelize'
import { fromPersistance } from '.'
import { DomainEvent } from '../../../core/domain'
import { sequelizeInstance } from '../../../sequelize.config'
import { EventHandler, Projector } from './Projection'
import * as readline from 'readline'

export type SequelizeModel = ModelCtor<Model<any, any>> & {
  associate?: (models: Record<string, SequelizeModel>) => void
  projector: Projector
}

export const makeSequelizeProjector = <ProjectionModel extends SequelizeModel>(
  model: ProjectionModel
): Projector => {
  const handlersByType: Record<string, EventHandler<any>> = {}

  const handleEvent = async <Event extends DomainEvent>(
    event: Event,
    transaction?: Transaction
  ) => {
    const { type } = event
    if (handlersByType[type]) {
      await handlersByType[type](event, transaction)
    }
  }

  return {
    on: (eventClass, handler) => {
      const type = eventClass.type

      if (handlersByType[type]) {
        throw new Error(`The event ${type} already has an handler for the projection ${model.name}`)
      }

      handlersByType[type] = handler
      return handler
    },
    initEventStream: (eventStream) => {
      eventStream.subscribe(async (event) => {
        await handleEvent(event)
      }, model.name)
    },
    rebuild: async (transaction) => {
      await model.destroy({ truncate: true, transaction })
      const events = await sequelizeInstance.query(
        `SELECT * FROM "eventStores" 
         WHERE type in (${Object.keys(handlersByType)
           .map((event) => `'${event}'`)
           .join(',')}) 
         ORDER BY "occurredAt" ASC`,
        {
          type: QueryTypes.SELECT,
          transaction,
        }
      )

      const total = events.length
      for (const [index, event] of events.entries()) {
        printProgress(`${index + 1}/${total}`)
        const eventToHandle = fromPersistance(event)
        eventToHandle && (await handleEvent(eventToHandle, transaction))
      }
    },
  }
}

const printProgress = (progress) => {
  readline.cursorTo(process.stdout, 0)
  process.stdout.write(progress)
}
