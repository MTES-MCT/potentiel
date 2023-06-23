import { Subscribe, Unsubscribe } from '@potentiel/core-domain';
import { RedisEvent, RedisEventHandler, consumerPool } from '@potentiel/redis-event-bus-consumer';

export const consumerSubscribe: Subscribe = async <TEvent extends RedisEvent>(
  eventType: TEvent['type'] | ReadonlyArray<TEvent['type']> | 'all',
  handler: RedisEventHandler<TEvent>,
) => {
  const eventTypes = Array.isArray(eventType) ? eventType : [eventType];

  const unsubscribes: Array<Unsubscribe> = [];

  for (const eventType of eventTypes) {
    const consumer = await consumerPool.getConsumer();
    consumer.consume(eventType, handler);
    unsubscribes.push(async () => {
      consumer.remove(eventType);
      return Promise.resolve();
    });
  }

  return async () => {
    for (const unsubscribe of unsubscribes) {
      await unsubscribe();
    }
  };
};
