import { Op } from 'sequelize'
import { MakeEventStoreDeps, okAsync, wrapInfra } from '@core/utils'
import { fromPersistance } from '../helpers'
import models from '../models'

const { EventStore } = models

export const loadAggregateEventsFromStore: MakeEventStoreDeps['loadAggregateEventsFromStore'] = (
  aggregateId
) => {
  const query = {
    where: {
      aggregateId: {
        [Op.overlap]: [aggregateId],
      },
    },
    order: [['occurredAt', 'ASC']],
  }

  return wrapInfra(EventStore.findAll(query))
    .map((events: any[]) => events.map((item) => item.get()))
    .map((events: any[]) => {
      return events.map(fromPersistance).filter(isNotNullOrUndefined)
    })
}

function isNotNullOrUndefined<T>(input: null | undefined | T): input is T {
  return input != null
}
