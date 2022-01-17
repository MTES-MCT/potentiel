import { rollbackEventsFromStore } from './rollbackEventsFromStore'
import { resetDatabase, fromPersistance, toPersistance } from '../helpers'
import { ProjectAbandoned } from '../../../modules/project'
import { BaseDomainEvent, DomainEvent, UniqueEntityID } from '../../../core/domain'
import models from '../models'
import { LegacyModificationImported } from '@modules/modificationRequest'
const { EventStore } = models

interface DummyEventPayload {}

class DummyEvent extends BaseDomainEvent<DummyEventPayload> implements DomainEvent {
  public static type: 'DummyEvent' = 'DummyEvent'
  public type = DummyEvent.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DummyEventPayload) {
    return undefined
  }
}

describe('rollbackEventsFromStore', () => {
  it('should remove the events from the event store', async () => {
    await resetDatabase()

    // Add 3 events in the store
    const event1 = new UniqueEntityID().toString()
    const event2 = new UniqueEntityID().toString()
    const event3 = new UniqueEntityID().toString()

    const events = [event1, event2, event3].map(
      (eventId) =>
        new DummyEvent({
          payload: {},
          original: { occurredAt: new Date(123), version: 1, eventId },
        })
    )

    await EventStore.bulkCreate(events.map(toPersistance))

    expect(await EventStore.findAll()).toHaveLength(3)

    const [notRolledbackEvent, ...rolledbackEvents] = events

    // call rollback on last two events
    await rollbackEventsFromStore(rolledbackEvents)

    // Check that the two are removed and the last on remains
    const remainingEvents = await EventStore.findAll()
    expect(remainingEvents).toHaveLength(1)
    expect(remainingEvents[0].id).toEqual(notRolledbackEvent.id)
  })
})
