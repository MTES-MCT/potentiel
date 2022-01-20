import { loadAggregateEventsFromStore } from './loadAggregateEventsFromStore'
import { resetDatabase, toPersistance } from '../helpers'
import models from '../models'
import { UniqueEntityID } from '@core/domain'
import { ProjectAbandoned } from '@modules/project'
import { LegacyModificationImported } from '@modules/modificationRequest'

const { EventStore } = models

describe('sequelize.loadAggregateEventsFromStore', () => {
  it('should return a list of all events corresponding to aggregate based on aggregatedId', async () => {
    const projectId = new UniqueEntityID().toString()

    await resetDatabase()

    const eventWithSingleAggregateId = new ProjectAbandoned({
      payload: {
        projectId,
        abandonAcceptedBy: '123',
      },
    })
    expect(eventWithSingleAggregateId.aggregateId).toEqual(projectId)
    await EventStore.create(toPersistance(eventWithSingleAggregateId))

    const eventWithMultipleAggregateIds = new LegacyModificationImported({
      payload: {
        projectId,
        importId: '123',
        modifications: [],
      },
    })
    expect(eventWithMultipleAggregateIds.aggregateId).toHaveLength(2)
    expect(eventWithMultipleAggregateIds.aggregateId).toEqual(expect.arrayContaining([projectId]))
    await EventStore.create(toPersistance(eventWithMultipleAggregateIds))

    // An event with another aggregateId
    await EventStore.create(
      toPersistance(
        new ProjectAbandoned({
          payload: {
            projectId: new UniqueEntityID().toString(),
            abandonAcceptedBy: '345',
          },
        })
      )
    )

    const res = await loadAggregateEventsFromStore(projectId)

    expect(res.isOk()).toBe(true)

    expect(res._unsafeUnwrap()).toHaveLength(2)

    expect(res._unsafeUnwrap()[0]).toBeInstanceOf(ProjectAbandoned)
    expect(res._unsafeUnwrap()[0].payload).toEqual({
      projectId,
      abandonAcceptedBy: '123',
    })

    expect(res._unsafeUnwrap()[1]).toBeInstanceOf(LegacyModificationImported)
    expect(res._unsafeUnwrap()[1].payload).toEqual({
      projectId,
      importId: '123',
      modifications: [],
    })
  })
})
