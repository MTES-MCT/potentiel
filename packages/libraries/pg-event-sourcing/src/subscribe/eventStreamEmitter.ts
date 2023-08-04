import { EventEmitter } from 'events';
import { DomainEvent, Subscriber } from '@potentiel/core-domain';
import { isEvent } from '../event';
import { getLogger } from '@potentiel/monitoring';
import { acknowledge } from './acknowledge';
import { Client } from 'pg';
import { getConnectionString } from '@potentiel/pg-helpers';

export class EventStreamEmitter extends EventEmitter {
  #client?: Client;

  async subscribe<TDomainEvent extends DomainEvent>({
    eventHandler,
    eventType,
    name,
  }: Subscriber<TDomainEvent>) {
    if (!this.#client) {
      const client = new Client(getConnectionString());
      client.connect((err) => {
        if (!err) {
          client.on('notification', (notification) => {
            this.emit(notification.channel, notification.payload);
          });
        } else {
          console.error(err);
        }
      });
      this.#client = client;
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
    await this.#client!.query(`listen ${name}`);
    return async () => {
      getLogger().info('Unsubscribe event handler', { name });
      this.removeListener(name, listener);
      await this.#client!.query(`unlisten ${name}`);
      getLogger().info(`Listeners lenght : ${this.listeners.length}`);

      if (!this.eventNames().length) {
        getLogger().info('Postgres Client ended because all event handler has been unsubscribed');
        this.#client!.end();
        this.#client = undefined;
      }
    };
  }
}
