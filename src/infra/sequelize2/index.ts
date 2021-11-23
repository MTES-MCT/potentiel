import * as models from './projections'
import { EventStreamFactory } from '../../core/utils'

export const initProjections2 = (makeEventStream: EventStreamFactory) => {
  const initializedProjections: string[] = []

  Object.values(models).forEach((model) => {
    model.projector?.initEventStream(makeEventStream(model.name))
    initializedProjections.push(model.name)
  })

  return initializedProjections
}

Object.values(models).forEach((model) => {
  model.associate && model.associate(models)
})

export * from './helpers'
