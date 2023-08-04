import { EventEmitter } from 'events';
import { DomainEvent, Subscriber, Unsubscribe } from '@potentiel/core-domain';
import { isEvent } from '../event';
import { getLogger } from '@potentiel/monitoring';
import { acknowledge } from './acknowledge';
import { eventStreamEmitter } from './subscribe';
import { listenToNewEvent } from './listenToNewEvent';

export class EventStreamEmitter extends EventEmitter {
  #isListening: boolean;
  #unlisten: () => Promise<void>;

  constructor() {
    super();
    this.#isListening = false;
    this.#unlisten = () => Promise.reject(new Error('EventStream emmitter is not listenning.'));
  }

  subscribe<TDomainEvent extends DomainEvent>({
    eventHandler,
    eventType,
    name,
  }: Subscriber<TDomainEvent>): Unsubscribe {
    this.#unlisten = listenToNewEvent(eventStreamEmitter, name);
    if (!this.#isListening) {
      this.#isListening = true;
    }

    const listener = async (payload: string) => {
      const event = JSON.parse(payload) as TDomainEvent;

      if (isEvent(event)) {
        if (
          eventType === 'all' ||
          (Array.isArray(eventType) ? eventType.includes(event.type) : event.type === eventType)
        ) {
          try {
            await eventHandler(event);
            await acknowledge(name, event);
          } catch (error) {
            getLogger().error(error as Error, {
              subscriberName: name,
              event,
            });
          }
        }
      } else {
        getLogger().warn('Unknown event', {
          event,
        });
      }
    };

    this.on(name, listener);

    return async () => {
      this.removeListener(name, listener);
      if (!this.listenerCount(name)) {
        await this.#unlisten();
        this.#isListening = false;
      }
    };
  }
}
