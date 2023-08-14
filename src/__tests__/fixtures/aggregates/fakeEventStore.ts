import { DomainEvent } from '../../../core/domain';
import { okAsync } from '../../../core/utils';
import { makeFakeEventBus } from './fakeEventBus';
import { jest } from '@jest/globals';

export const makeFakeEventStore = (fakeEvents?: DomainEvent[]) => {
  const { publish, subscribe } = makeFakeEventBus();
  const _innerPublishEvents = jest.fn((events: DomainEvent[]) => okAsync(null));
  return {
    publish,
    subscribe,
    _innerPublishEvents,
    transaction: jest.fn((aggregateId, fn) => {
      //@ts-ignore
      return fn(fakeEvents || []).andThen(_innerPublishEvents);
    }),
  };
};
