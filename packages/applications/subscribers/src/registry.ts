import { mediator } from 'mediateur';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

const registry = new Map<`${string}|${string}`, string>();

export const addSubscriber = (
  streamCategory: string,
  subscriberName: string,
  messageType: string,
) => {
  const subscriberKey = `${streamCategory}|${subscriberName}` as const;
  registry.set(subscriberKey, messageType);
};

export const runSubscriber = async (
  streamCategory: string,
  subscriberName: string,
  event: Event,
) => {
  const subscriberKey = registry.get(`${streamCategory}|${subscriberName}`);
  if (!subscriberKey) {
    throw new Error(`No subscriber found for ${streamCategory}|${subscriberName}`);
  }

  await mediator.send({
    type: subscriberKey,
    data: event,
  });
};

export const listSubscribers = () => Array.from(registry.keys());
