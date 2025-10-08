import { Message, mediator } from 'mediateur';

import { Event, Subscriber, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { runWorkerWithContext } from '@potentiel-applications/request-context';

export const createSubscriptionSetup = <TCategory extends string>(streamCategory: TCategory) => {
  const listeners: (() => Promise<void>)[] = [];
  const setupSubscription = async <TEvent extends Event, TMessage extends Message<string, TEvent>>({
    messageType,
    eventType,
    name,
  }: {
    messageType: TMessage['type'];
    eventType: Subscriber<TEvent>['eventType'];
    name: 'projector' | 'notifications' | 'saga' | 'historique' | string;
  }): Promise<void> => {
    const unsubscribe = await subscribe<TEvent>({
      name,
      eventType,
      eventHandler: async (event) =>
        runWorkerWithContext({
          app: 'subscribers',
          callback: async () => {
            await mediator.send<Message<TMessage['type'], TMessage['data']>>({
              type: messageType,
              data: event,
            });
          },
        }),
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
