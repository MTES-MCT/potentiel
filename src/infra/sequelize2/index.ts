import * as models from './projections'
import { HasSubscribe } from '../../core/utils'

export const initProjections2 = (eventStream: HasSubscribe) => {
  const initializedProjections: string[] = []

  Object.values(models).forEach((model) => {
    model.projector?.initEventStream(eventStream)
    initializedProjections.push(model.name)
  })

  return initializedProjections
}

Object.values(models).forEach((model) => {
  model.associate && model.associate(models)
})

export * from './helpers'
