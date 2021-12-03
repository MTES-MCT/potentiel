import { BaseDomainEvent, DomainEvent, EventBus } from '../../core/domain'
import { errAsync, okAsync } from '../../core/utils'
import { InfraNotAvailableError } from '../../modules/shared'
import { makeDualPublish } from './dualPublish'

interface DummyEventPayload {}
class DummyEvent extends BaseDomainEvent<DummyEventPayload> implements DomainEvent {
  public static type: 'DummyEvent' = 'DummyEvent'
  public type = DummyEvent.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DummyEventPayload) {
    return undefined
  }
}

describe('dualPublish', () => {
  it(`should publish event with both Memory and Redis EventBuses`, () => {
    const firstEventBus = jest.fn() as EventBus['publish']
    const secondEventBus = jest.fn() as EventBus['publish']

    const dualPublish = makeDualPublish({
      redisPublish: firstEventBus,
      inMemoryPublish: secondEventBus,
    })

    const eventToPublish = new DummyEvent({ payload: {} })

    dualPublish(eventToPublish)

    expect(firstEventBus).toHaveBeenCalledTimes(1)
    expect(secondEventBus).toHaveBeenCalledTimes(1)
  })

  describe(`when an error is returned by both EventBus`, () => {
    it(`should return only the error of the inMemoryEventBus`, async () => {
      const inMemoryPublish = () => errAsync<null, Error>(new Error('In memory error'))
      const redisPublish = () => errAsync<null, Error>(new Error('Redis error'))

      const dualPublish = makeDualPublish({
        redisPublish: redisPublish,
        inMemoryPublish: inMemoryPublish,
      })

      const eventToPublish = new DummyEvent({ payload: {} })

      const result = await dualPublish(eventToPublish)

      expect(result.isErr()).toBe(true)
      expect(result._unsafeUnwrapErr().message).toEqual('In memory error')
    })
  })

  describe(`when an error is returned only by the redisEventBus`, () => {
    it(`should not return the error`, async () => {
      const inMemoryPublish = () => okAsync<null, InfraNotAvailableError>(null)
      const redisPublish = () => errAsync<null, InfraNotAvailableError>(new Error('Redis error'))

      const dualPublish = makeDualPublish({
        redisPublish: redisPublish,
        inMemoryPublish: inMemoryPublish,
      })
      const eventToPublish = new DummyEvent({ payload: {} })

      const result = await dualPublish(eventToPublish)

      expect(result.isErr()).toBe(false)
    })
  })
})
