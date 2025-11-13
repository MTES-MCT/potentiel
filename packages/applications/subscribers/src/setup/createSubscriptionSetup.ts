import { Message, mediator } from 'mediateur';
import { bulkhead, noop, IPolicy, wrap } from 'cockatiel';

import { Subscriber, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { runWorkerWithContext } from '@potentiel-applications/request-context';
import { getLogger } from '@potentiel-libraries/monitoring';
import { DomainEvent } from '@potentiel-domain/core';

let globalPolicy: IPolicy | undefined = undefined;
const getGlobalPolicy = () => {
  if (!globalPolicy) {
    const maxConcurrentSubscribers = parseInt(process.env.MAX_CONCURRENT_SUBSCRIBERS ?? '-1');
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
  const setupSubscription = async <
    TEvent extends DomainEvent,
    TMessage extends Message<string, TEvent>,
  >({
    messageType,
    eventType,
    name,
    maxConcurrency,
  }: {
    messageType: TMessage['type'];
    eventType: Subscriber<TEvent>['eventType'];
    name: 'projector' | 'history' | 'notifications' | 'historique' | `${string}-saga`;
    maxConcurrency?: number;
  }): Promise<void> => {
    const policy = maxConcurrency
      ? wrap(bulkhead(maxConcurrency, Infinity), getGlobalPolicy())
      : getGlobalPolicy();
    const unsubscribe = await subscribe<TEvent>({
      name,
      eventType,
      eventHandler: (event) =>
        policy.execute(async () =>
          runWorkerWithContext({
            app: 'subscribers',
            callback: async () => {
              await mediator.send<Message<TMessage['type'], TMessage['data']>>({
                type: messageType,
                data: event,
              });
            },
          }),
        ),
      streamCategory,
    });
    listeners.push(unsubscribe);
  };

  const clearSubscriptions = async () => {
    for (const unlisten of listeners) {
      await unlisten();
    }
  };

  return {
    setupSubscription,
    clearSubscriptions,
  };
};
