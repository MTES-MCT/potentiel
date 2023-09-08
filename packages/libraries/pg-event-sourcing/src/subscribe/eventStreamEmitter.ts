import { EventEmitter } from 'events';
import { DomainEvent, Subscriber } from '@potentiel/core-domain';
import { isEvent } from '../event';
import { getLogger } from '@potentiel/monitoring';
import { acknowledge } from './acknowledge';
import { Client } from 'pg';
import { getConnectionString } from '@potentiel/pg-helpers';
import { loadFromStream } from '../load/loadFromStream';

export class EventStreamEmitter extends EventEmitter {
  #client: Client;
  #name: string;
  #streamCategory: string;

  constructor(streamCategory: string, name: string) {
    super();
    this.#client = new Client(getConnectionString());
    this.#name = name;
    this.#streamCategory = streamCategory;
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
    await this.#client.query(`unlisten "${this.#streamCategory}|${this.#name}"`);
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
          event.type !== 'RebuildTriggered' &&
          (eventType === 'all' ||
            (Array.isArray(eventType) ? eventType.includes(event.type) : event.type === eventType))
        ) {
          try {
            await eventHandler(event);
            await acknowledge(`${this.#streamCategory}|${this.#name}`, event);
          } catch (error) {
            getLogger().error(error as Error, {
              subscriberName: this.#name,
              event,
            });
          }
        } else if (event.type === 'RebuildTriggered') {
          getLogger().info(
            `RebuildTriggered event received: ${`${this.#streamCategory}|${this.#name}`}`,
          );
          const events =
            eventType === 'all'
              ? await loadFromStream({
                  streamId: event.stream_id,
                })
              : await loadFromStream({
                  streamId: event.stream_id,
                  eventTypes: Array.isArray(eventType) ? eventType : [eventType],
                });

          for (const evt of [event, ...events]) {
            try {
              getLogger().info('Rebuilding projection');
              await eventHandler(evt as unknown as TDomainEvent);
            } catch (error) {
              getLogger().error(error as Error, {
                subscriberName: `${this.#streamCategory}|${this.#name}`,
                event,
              });
            }
          }
          await acknowledge(`${this.#streamCategory}|${this.#name}`, event);
        } else {
          getLogger().warn('Unknown event', {
            event,
          });
          await acknowledge(`${this.#streamCategory}|${this.#name}`, event);
        }
      }
    };

    this.on(`${this.#streamCategory}|${this.#name}`, listener);

    this.#client.on('notification', (notification) => {
      this.emit(notification.channel, notification.payload);
    });

    await this.#client.query(`listen "${this.#streamCategory}|${this.#name}"`);
  }
}
