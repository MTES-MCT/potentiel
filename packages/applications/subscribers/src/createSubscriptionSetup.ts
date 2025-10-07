import { Message } from 'mediateur';

import { Event, Subscriber } from '@potentiel-infrastructure/pg-event-sourcing';

import { addSubscriber } from './registry';

export const createSubscriptionSetup = <TCategory extends string>(streamCategory: TCategory) => {
  const listeners: (() => Promise<void>)[] = [];
  const setupSubscription = async <TEvent extends Event, TMessage extends Message<string, TEvent>>({
    messageType,
    // TODO eventType,
    name,
  }: {
    messageType: TMessage['type'];
    eventType: Subscriber<TEvent>['eventType'];
    name: 'projector' | 'notifications' | 'saga' | 'historique' | string;
  }): Promise<void> => {
    addSubscriber(streamCategory, name, messageType);
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
