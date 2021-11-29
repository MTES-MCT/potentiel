import { Model as SModel, ModelCtor } from 'sequelize'
import type { EventHandler, HasSubscribe, Projector } from '../../../core/utils'

export type SequelizeModel = ModelCtor<SModel<any, any>> & {
  associate?: (models: Record<string, SequelizeModel>) => void
  projector: Projector
}

export const makeSequelizeProjector = <ProjectionModel extends SequelizeModel>(
  model: ProjectionModel
): Projector => {
  const handlersByType: Record<string, EventHandler<any>[]> = {}

  return {
    on: (eventClass, handler) => {
      const type = eventClass.type

      if (!handlersByType[type]) handlersByType[type] = []
      handlersByType[type].push(handler)

      return handler
    },
    initEventStream: (eventStream) => {
      eventStream.subscribe((event) => {
        const { type } = event
        handlersByType[type] && handlersByType[type].forEach((handler) => handler(event))
      }, model.name)
    },
  }
}
