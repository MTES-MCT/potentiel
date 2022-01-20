import { BaseDomainEvent, DomainEvent } from '@core/domain'
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

describe('expect.toHavePublishedTimes(n)', () => {
  it('should pass if the eventBus triggered n events', () => {
    const eventBus = makeFakeEventBus()
    eventBus.publish(new DummyEvent({ payload: {} }))
    eventBus.publish(new DummyEvent({ payload: {} }))
    eventBus.publish(new DummyEvent({ payload: {} }))

    expect(eventBus).toHavePublishedTimes(3)
  })

  it('should fail if the eventBus triggered less than n events', () => {
    const eventBus = makeFakeEventBus()
    eventBus.publish(new DummyEvent({ payload: {} }))
    eventBus.publish(new DummyEvent({ payload: {} }))

    expect(eventBus).not.toHavePublishedTimes(3)
  })

  it('should fail if the eventBus triggered more than n events', () => {
    const eventBus = makeFakeEventBus()
    eventBus.publish(new DummyEvent({ payload: {} }))
    eventBus.publish(new DummyEvent({ payload: {} }))
    eventBus.publish(new DummyEvent({ payload: {} }))
    eventBus.publish(new DummyEvent({ payload: {} }))

    expect(eventBus).not.toHavePublishedTimes(3)
  })

  it('should fail if the eventBus triggered no events', () => {
    const eventBus = makeFakeEventBus()

    expect(eventBus).not.toHavePublishedTimes(3)
  })
})
