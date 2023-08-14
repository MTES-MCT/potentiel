import { EventEmitter } from 'events';
import { DomainEvent, Subscriber } from '@potentiel/core-domain';
import { isEvent } from '../event';
import { getLogger } from '@potentiel/monitoring';
import { acknowledge } from './acknowledge';
import { Client } from 'pg';
import { getConnectionString } from '@potentiel/pg-helpers';

export class EventStreamEmitter extends EventEmitter {
  #client: Client;
  #name: string;

  constructor(name: string) {
    super();
    this.#client = new Client(getConnectionString());
    this.#name = name;
  }

  async connect() {
    return new Promise<void>((resolve, reject) => {
      this.#client.connect((err) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }

  async disconnect() {
    await this.#client.query(`unlisten ${this.#name}`);
    this.removeAllListeners(this.#name);
    await this.#client.end();
  }

  async listen<TDomainEvent extends DomainEvent>({
    eventHandler,
    eventType,
  }: Subscriber<TDomainEvent>) {
    const listener = async (payload: string) => {
      const event = JSON.parse(payload) as TDomainEvent;
      if (isEvent(event)) {
        if (
          eventType === 'all' ||
          (Array.isArray(eventType) ? eventType.includes(event.type) : event.type === eventType)
        ) {
          try {
            await eventHandler(event);
            await acknowledge(this.#name, event);
          } catch (error) {
            getLogger().error(error as Error, {
              subscriberName: this.#name,
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

    this.on(this.#name, listener);

    this.#client.on('notification', (notification) => {
      this.emit(notification.channel, notification.payload);
    });

    await this.#client.query(`listen ${this.#name}`);
  }
}
