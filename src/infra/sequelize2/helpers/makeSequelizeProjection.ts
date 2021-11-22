import { Model as SModel, ModelCtor } from 'sequelize'
import { EventStream, EventStreamFactory, HandlerFactory, Projection } from '../../../core/utils'

export type SequelizeModel = ModelCtor<SModel<any, any>> & {
  associate: (models: Record<string, SequelizeModel>) => void
}

export type SequelizeProjection<
  ProjectionModel extends SequelizeModel
> = Projection<ProjectionModel> & { model: ProjectionModel }

export const makeSequelizeProjection = <ProjectionModel extends SequelizeModel>(
  model: ProjectionModel
): SequelizeProjection<ProjectionModel> => {
  let eventStream: EventStream | undefined

  // we can surely find a better type for handlers it's actually Record<Event['type'], HandlerFactor<Event>>
  // Store a list of handlers instead, to be able to have multiple handlers for the same event
  const handlers: { type: string; handler: HandlerFactory<any, any> }[] = []

  const projection: SequelizeProjection<ProjectionModel> = {
    handle: (eventClass, handler) => {
      if (eventStream) {
        eventStream.on(eventClass.type, handler(model))
      }

      handlers.push({ type: eventClass.type, handler })

      return handler(model)
    },
    lock: async () => {
      if (!eventStream) {
        throw new Error('Cannot lock before init event stream')
      }
      eventStream.lock()
    },
    unlock: async () => {
      if (!eventStream) {
        throw new Error('Cannot unlock before init event stream')
      }
      eventStream.unlock()
    },
    transaction: async (callback) => {
      // TODO: call model.sequelize.transaction ?
    },
    initEventStream: (makeEventStream: EventStreamFactory) => {
      eventStream = makeEventStream(model.name)

      handlers.forEach(({ type, handler }) => {
        // Weird, eventStream can't be undefined, we just set it...
        eventStream!.on(type, handler(model))
      })
    },
    model,
    get name() {
      return model.name
    },
  }

  return projection
}
