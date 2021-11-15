import { BaseDomainEvent, DomainEvent } from '../../core/domain'
import { makeFakeEventBus } from '../fixtures/aggregates'

interface DummyEventPayload {}

class DummyEvent extends BaseDomainEvent<DummyEventPayload> implements DomainEvent {
  public static type: 'DummyEvent' = 'DummyEvent'
  public type = DummyEvent.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DummyEventPayload) {
    return undefined
  }
}

interface OtherEventPayload {}

class OtherEvent extends BaseDomainEvent<OtherEventPayload> implements DomainEvent {
  public static type: 'OtherEvent' = 'OtherEvent'
  public type = OtherEvent.type
  currentVersion = 1

  aggregateIdFromPayload(payload: OtherEventPayload) {
    return undefined
  }
}

describe('expect.toHavePublished(eventType)', () => {
  it('should pass if the eventBus triggered one event of the type', () => {
    const eventBus = makeFakeEventBus()
    eventBus.publish(new DummyEvent({ payload: {} }))

    expect(eventBus).toHavePublished(DummyEvent)
  })

  it('should pass if the eventBus triggered severals events of the type', () => {
    const eventBus = makeFakeEventBus()
    eventBus.publish(new DummyEvent({ payload: {} }))
    eventBus.publish(new DummyEvent({ payload: {} }))
    eventBus.publish(new DummyEvent({ payload: {} }))

    expect(eventBus).toHavePublished(DummyEvent)
  })

  it('should fail if the eventBus triggered no events of any type', () => {
    const eventBus = makeFakeEventBus()

    expect(eventBus).not.toHavePublished(DummyEvent)
  })

  it('should fail if the eventBus triggered events of another type', () => {
    const eventBus = makeFakeEventBus()
    eventBus.publish(new OtherEvent({ payload: {} }))

    expect(eventBus).not.toHavePublished(DummyEvent)
  })
})
