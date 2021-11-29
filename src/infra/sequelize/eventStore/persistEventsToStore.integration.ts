import { persistEventsToStore } from './persistEventsToStore'
import { resetDatabase, fromPersistance } from '../helpers'
import { ProjectAbandoned } from '../../../modules/project'
import { UniqueEntityID } from '../../../core/domain'
import models from '../models'
import { LegacyModificationImported } from '../../../modules/modificationRequest'
const { EventStore } = models

describe('sequelize.persistEventsToStore', () => {
  it('should add the serialized event to the event store table', async () => {
    const projectId = new UniqueEntityID().toString()
    const requestId = new UniqueEntityID().toString()

    await resetDatabase()

    const eventWithSingleAggregateId = new ProjectAbandoned({
      payload: {
        projectId,
        abandonAcceptedBy: '123',
      },
      original: {
        occurredAt: new Date(1234),
        version: 1,
      },
      requestId,
    })
    expect(eventWithSingleAggregateId.aggregateId).toEqual(projectId)

    const eventWithMultipleAggregateIds = new LegacyModificationImported({
      payload: {
        projectId,
        importId: '123',
        modifications: [],
      },
      original: {
        occurredAt: new Date(3456),
        version: 2,
      },
    })
    expect(eventWithMultipleAggregateIds.aggregateId).toHaveLength(2)
    expect(eventWithMultipleAggregateIds.aggregateId).toEqual(expect.arrayContaining([projectId]))

    await persistEventsToStore([eventWithSingleAggregateId, eventWithMultipleAggregateIds])

    const events = await EventStore.findAll()

    expect(events).toHaveLength(2)

    expect(events[0]).toMatchObject({
      type: 'ProjectAbandoned',
      payload: {
        projectId,
        abandonAcceptedBy: '123',
      },
      occurredAt: new Date(1234),
      version: '1',
      aggregateId: [projectId],
      requestId,
    })

    expect(events[1]).toMatchObject({
      type: 'LegacyModificationImported',
      payload: {
        projectId,
        importId: '123',
        modifications: [],
      },
      occurredAt: new Date(3456),
      version: '2',
      aggregateId: ['123', projectId],
      requestId: null,
    })
  })
})
