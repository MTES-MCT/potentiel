import { BaseDomainEvent, DomainEvent, EventBus } from '../../core/domain'
import { errAsync, okAsync } from '../../core/utils'
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

  describe(`when an error is returned by both EventBus`, () => {
    it(`should return onoly the error of the inMemoryEventBus`, async () => {
      const inMemoryEventBus = {
        publish: () => errAsync(new Error('In memory error')),
        subscribe: jest.fn(),
      } as EventBus
      const redisEventBus = {
        publish: () => errAsync(new Error('Redis error')),
        subscribe: jest.fn(),
      } as EventBus

      const dualEventBus: EventBus = makeDualEventBus({
        inMemoryEventBus: inMemoryEventBus,
        redisEventBus: redisEventBus,
      })
      const eventToPublish = new DummyEvent({ payload: {} })

      const result = await dualEventBus.publish(eventToPublish)

      expect(result.isErr()).toBe(true)
      expect(result._unsafeUnwrapErr().message).toEqual('In memory error')
    })
  })

  describe(`when an error is returned only by the redisEventBus`, () => {
    it(`should not return the error`, async () => {
      const inMemoryEventBus = {
        publish: () => okAsync(null),
        subscribe: jest.fn(),
      } as EventBus
      const redisEventBus = {
        publish: () => errAsync(new Error('Redis error')),
        subscribe: jest.fn(),
      } as EventBus

      const dualEventBus: EventBus = makeDualEventBus({
        inMemoryEventBus: inMemoryEventBus,
        redisEventBus: redisEventBus,
      })
      const eventToPublish = new DummyEvent({ payload: {} })

      const result = await dualEventBus.publish(eventToPublish)

      expect(result.isErr()).toBe(false)
    })
  })
})
