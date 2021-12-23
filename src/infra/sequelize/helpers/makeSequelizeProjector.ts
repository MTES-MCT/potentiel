import { Model as SModel, ModelCtor } from 'sequelize'
import type { EventHandler, Projector } from '../../../core/utils'

export type SequelizeModel = ModelCtor<SModel<any, any>> & {
  associate?: (models: Record<string, SequelizeModel>) => void
  projector: Projector
}

export const makeSequelizeProjector = <ProjectionModel extends SequelizeModel>(
  model: ProjectionModel
): Projector => {
  const handlersByType: Record<string, EventHandler<any>> = {}

  const handleEvent = async (event) => {
    const { type } = event
    if (handlersByType[type]) {
      await handlersByType[type](event)
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
    handleEvent,
  }
}
