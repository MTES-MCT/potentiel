import { Message, mediator } from 'mediateur';

import { Event, Subscriber, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';

export const createSubscriptionSetup = (streamCategory: string) => {
  const listeners: (() => Promise<void>)[] = [];
  const setupSubscription = async <TEvent extends Event, TMessage extends Message<string, TEvent>>({
    messageType,
    eventType,
    name,
  }: {
    messageType: TMessage['type'];
    eventType: Subscriber<TEvent>['eventType'];
    name: 'projector' | 'notifications' | 'saga' | string;
  }) => {
    const unsubscribe = await subscribe<TEvent>({
      name,
      eventType,
      eventHandler: async (event) => {
        await mediator.send<Message<TMessage['type'], TMessage['data']>>({
          type: messageType,
          data: event,
        });
      },
      streamCategory,
    });
    listeners.push(unsubscribe);
  };

  const clearListeners = async () => {
    for (const unlisten of listeners) {
      await unlisten();
    }
  };

  return {
    setupSubscription,
    clearListeners,
  };
};
