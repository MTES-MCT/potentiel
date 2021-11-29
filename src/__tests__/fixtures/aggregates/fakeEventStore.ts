import { DomainEvent } from '../../../core/domain'
import { okAsync } from '../../../core/utils'
import { makeFakeEventBus } from './fakeEventBus'

export const makeFakeEventStore = (fakeEvents?: DomainEvent[]) => {
  const { publish, subscribe } = makeFakeEventBus()
  const _innerPublishEvents = jest.fn((events: DomainEvent[]) => okAsync(null))
  return {
    publish,
    subscribe,
    _innerPublishEvents,
    transaction: jest.fn((aggregateId, fn) => {
      return fn(fakeEvents || []).andThen(_innerPublishEvents)
    }),
  }
}
