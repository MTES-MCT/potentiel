import { BaseDomainEvent, DomainEvent, EventBus } from '../../core/domain'
import { makeDualEventBus } from './dualEventBus'

interface DummyEventPayload {}
class DummyEvent extends BaseDomainEvent<DummyEventPayload> implements DomainEvent {
  public static type: 'DummyEvent' = 'DummyEvent'
  public type = DummyEvent.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DummyEventPayload) {
    return undefined
  }
}

describe('dualEventBus', () => {
  it(`should publish event with all eventBus`, () => {
    const firstEventBus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    } as EventBus
    const secondEventBus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    } as EventBus

    const dualEventBus: EventBus = makeDualEventBus({
      inMemoryEventBus: firstEventBus,
      redisEventBus: secondEventBus,
    })
    const eventToPublish = new DummyEvent({ payload: {} })

    dualEventBus.publish(eventToPublish)

    expect(firstEventBus.publish).toHaveBeenCalledTimes(1)
    expect(secondEventBus.publish).toHaveBeenCalledTimes(1)
  })
})
