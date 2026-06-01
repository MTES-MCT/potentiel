import { bulkhead, type IPolicy, noop, wrap } from 'cockatiel';
import { type Message, mediator } from 'mediateur';

import { runWorkerWithContext } from '@potentiel-applications/request-context';
import type { DomainEvent } from '@potentiel-domain/core';
import { type Subscriber, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { getLogger } from '@potentiel-libraries/monitoring';

let globalPolicy: IPolicy | undefined;
const getGlobalPolicy = () => {
  if (!globalPolicy) {
    const maxConcurrentSubscribers = parseInt(process.env.MAX_CONCURRENT_SUBSCRIBERS ?? '-1', 10);
    if (maxConcurrentSubscribers > 0) {
      globalPolicy = bulkhead(maxConcurrentSubscribers, Infinity);
    } else {
      getLogger('subscribers').warn('No max concurrent subscribers set, using noop policy');
      globalPolicy = noop;
    }
  }
  return globalPolicy;
};

export const createSubscriptionSetup = <TCategory extends string>(streamCategory: TCategory) => {
  const listeners: (() => Promise<void>)[] = [];
  type SubscriptionOptions<TEvent extends DomainEvent, TMessage extends Message<string, TEvent>> = {
    messageType: TMessage['type'];
    eventType: Subscriber<TEvent>['eventType'];
    name: 'projector' | 'history' | 'notifications' | `${string}-saga`;
    maxConcurrency?: number;
  };

  const subscriptions: (SubscriptionOptions<DomainEvent, Message<string, DomainEvent>> & {
    streamCategory: string;
  })[] = [];

  const addSubscription = async <
    TEvent extends DomainEvent,
    TMessage extends Message<string, TEvent>,
  >({
    messageType,
    eventType,
    name,
    maxConcurrency,
  }: SubscriptionOptions<TEvent, TMessage>): Promise<void> => {
    subscriptions.push({ messageType, eventType, name, maxConcurrency, streamCategory });
  };

  const clearSubscriptions = async () => {
    for (const unlisten of listeners) {
      await unlisten();
    }
  };

  const setupSubscriptions = async () => {
    for (const { messageType, eventType, name, maxConcurrency, streamCategory } of subscriptions) {
      const policy = maxConcurrency
        ? wrap(bulkhead(maxConcurrency, Infinity), getGlobalPolicy())
        : getGlobalPolicy();
      const unsubscribe = await subscribe({
        name,
        eventType,
        eventHandler: (event) =>
          policy.execute(async () =>
            runWorkerWithContext({
              app: 'subscribers',
              callback: async () => {
                await mediator.send({ type: messageType, data: event });
              },
            }),
          ),
        streamCategory,
      });
      listeners.push(unsubscribe);
    }
  };
  const listSubscriptions = () => subscriptions;

  return {
    addSubscription,
    clearSubscriptions,
    setupSubscriptions,
    listSubscriptions,
  };
};

export type SubscriberSetup = Omit<ReturnType<typeof createSubscriptionSetup>, 'addSubscription'>;

export const mergeSubscriptionSetup = (...subscriptions: SubscriberSetup[]): SubscriberSetup => {
  return {
    clearSubscriptions: async () => {
      for (const subscription of subscriptions) {
        await subscription.clearSubscriptions();
      }
    },
    setupSubscriptions: async () => {
      for (const subscription of subscriptions) {
        await subscription.setupSubscriptions();
      }
    },
    listSubscriptions: () => subscriptions.flatMap((s) => s.listSubscriptions()),
  };
};
