import { BaseDomainEvent, DomainEvent, EventBus } from '../../core/domain'
import { errAsync, okAsync } from '../../core/utils'
import { makePublishEvent } from './dualEventBus'

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
  it(`should publish event with both Memory and Redis EventBuses`, () => {
    const firstEventBus = jest.fn() as EventBus['publish']
    const secondEventBus = jest.fn() as EventBus['publish']

    const publishEvent = makePublishEvent({
      publishInRedisEventBus: firstEventBus,
      publishInMemory: secondEventBus,
    })

    const eventToPublish = new DummyEvent({ payload: {} })

    publishEvent(eventToPublish)

    expect(firstEventBus).toHaveBeenCalledTimes(1)
    expect(secondEventBus).toHaveBeenCalledTimes(1)
  })

  describe(`when an error is returned by both EventBus`, () => {
    it(`should return only the error of the inMemoryEventBus`, async () => {
      const publishInMemory = () => errAsync(new Error('In memory error'))
      const publishInRedisEventBus = () => errAsync(new Error('Redis error'))

      const publishEvent = makePublishEvent({
        publishInRedisEventBus,
        publishInMemory,
      })

      const eventToPublish = new DummyEvent({ payload: {} })

      const result = await publishEvent(eventToPublish)

      expect(result.isErr()).toBe(true)
      expect(result._unsafeUnwrapErr().message).toEqual('In memory error')
    })
  })

  describe(`when an error is returned only by the redisEventBus`, () => {
    it(`should not return the error`, async () => {
      const publishInMemory = () => okAsync(null)
      const publishInRedisEventBus = () => errAsync(new Error('Redis error'))

      const publishEvent = makePublishEvent({
        publishInRedisEventBus,
        publishInMemory,
      })
      const eventToPublish = new DummyEvent({ payload: {} })

      const result = await publishEvent(eventToPublish)

      expect(result.isErr()).toBe(false)
    })
  })
})
