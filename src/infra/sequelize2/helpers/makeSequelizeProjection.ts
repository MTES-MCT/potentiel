import { Model as SModel, ModelCtor } from 'sequelize'
import type { EventHandler, EventStream, Projector } from '../../../core/utils'

export type SequelizeModel = ModelCtor<SModel<any, any>> & {
  associate?: (models: Record<string, SequelizeModel>) => void
  projector?: Projector
}

export const makeSequelizeProjector = <ProjectionModel extends SequelizeModel>(
  model: ProjectionModel
): Projector => {
  let eventStream: EventStream | undefined

  const handlers: { type: string; handler: EventHandler<any> }[] = []

  return {
    handle: (eventClass, handler) => {
      if (eventStream) {
        eventStream.handle(eventClass.type, handler)
      }

      handlers.push({ type: eventClass.type, handler })

      return handler
    },
    rebuild: async () => {
      // TODO
    },
    initEventStream: (_eventStream) => {
      eventStream = _eventStream

      handlers.forEach(({ type, handler }) => {
        // Weird, eventStream can't be undefined, we just set it...
        eventStream!.handle(type, handler)
      })
    },
  }
}
