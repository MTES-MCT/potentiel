import { randomUUID } from 'crypto';
import { createConsumer } from './createConsumer';
import { Consumer } from './consumer';

const consumers: Array<Consumer> = [];

const getConsumer = async () => {
  let consumer: Consumer;
  if (!consumers.length || consumers[consumers.length - 1].getSize() === getPoolMaxSize()) {
    consumer = await createConsumer(randomUUID());
    consumers.push(consumer);
  } else {
    consumer = consumers[consumers.length - 1];
  }

  return consumer;
};

const getPoolMaxSize = () => {
  return +(process.env.CONSUMER_POOL_SIZE || 10);
};

export const consumerPool = {
  getConsumer,
  getPoolMaxSize,
};
