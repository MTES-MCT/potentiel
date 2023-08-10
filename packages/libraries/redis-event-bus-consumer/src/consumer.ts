import { RedisEvent, RedisEventHandler } from './redisEvent';

export type Consumer = {
  getSize: () => number;
  getName(): string;
  consume: <TEvent extends RedisEvent>(
    type: TEvent['type'],
    handler: RedisEventHandler<TEvent>,
  ) => void;
  remove: <TEvent extends RedisEvent>(type: TEvent['type']) => void;
  kill: () => void;
};
