import { MakeEventStoreDeps, okAsync, wrapInfra } from '@core/utils'
import { toPersistance } from '../helpers'
import models from '../models'
const { EventStore } = models

export const persistEventsToStore: MakeEventStoreDeps['persistEventsToStore'] = (events) => {
  return wrapInfra(EventStore.bulkCreate(events.map(toPersistance)))
}
