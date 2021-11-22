import { EventStreamFactory } from '../../core/utils'
import * as projections from './projections'

// // Useless if we import * as projections from './projections' ?

export const initProjections2 = (makeEventStream: EventStreamFactory) => {
  const initializedProjections: string[] = []

  Object.values(projections).forEach((projection) => {
    projection.initEventStream(makeEventStream)

    initializedProjections.push(projection.name)
  })

  return initializedProjections
}

export * from './helpers'
