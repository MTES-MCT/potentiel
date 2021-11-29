import { Model as SModel, ModelCtor } from 'sequelize'
import type { EventHandler, HasSubscribe, Projector } from '../../../core/utils'

export type SequelizeModel = ModelCtor<SModel<any, any>> & {
  associate?: (models: Record<string, SequelizeModel>) => void
  projector: Projector
}

export const makeSequelizeProjector = <ProjectionModel extends SequelizeModel>(
  model: ProjectionModel
): Projector => {
  let eventStream: HasSubscribe | undefined

  const handlers: { type: string; handler: EventHandler<any> }[] = []

  return {
    on: (eventClass, handler) => {
      if (eventStream) {
        eventStream.subscribe(eventClass.type, handler, model.name)
      }

      handlers.push({ type: eventClass.type, handler })

      return handler
    },
    initEventStream: (_eventStream) => {
      eventStream = _eventStream

      handlers.forEach(({ type, handler }) => {
        // Weird, eventStream can't be undefined, we just set it...
        eventStream!.subscribe(type, handler, model.name)
      })
    },
  }
}
