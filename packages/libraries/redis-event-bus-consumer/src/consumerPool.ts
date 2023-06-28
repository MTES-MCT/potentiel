import { randomUUID } from 'crypto';
import { createConsumer } from './createConsumer';
import { Consumer } from './consumer';
import { getLogger } from '@potentiel/monitoring';

let consumers: Array<Consumer> = [];

const getConsumer = async () => {
  let consumer = consumers.find((c) => c.getSize() < getPoolMaxSize());

  if (!consumer) {
    consumer = await createConsumer(randomUUID());
    consumers.push(consumer);
    getLogger().info('New consumer created', { name: consumer.getName() });
  }

  return consumer;
};

const getPoolMaxSize = () => {
  return +(process.env.CONSUMER_POOL_SIZE || 10);
};

const kill = () => {
  for (const consumer of consumers) {
    consumer.kill();
    getLogger().info('Consumer killed', { name: consumer.getName() });
  }
  consumers = [];
};

export const consumerPool = {
  getConsumer,
  getPoolMaxSize,
  kill,
};
