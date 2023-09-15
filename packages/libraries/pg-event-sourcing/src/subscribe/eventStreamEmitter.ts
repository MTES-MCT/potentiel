import { EventEmitter } from 'events';
import { DomainEvent, Subscriber } from '@potentiel/core-domain';
import { isEvent, Event } from '../event';
import { getLogger } from '@potentiel/monitoring';
import { acknowledge } from './acknowledgement/acknowledge';
import { Client } from 'pg';
import { getConnectionString } from '@potentiel/pg-helpers';
import { rebuild } from './rebuild/rebuild';
import format from 'pg-format';
import { RebuildTriggered } from '@potentiel/core-domain-views';

type ChannelName = 'rebuild' | 'domain-event' | 'unknown-event';

export class EventStreamEmitter extends EventEmitter {
  #client: Client;
  #subscriber: Subscriber;

  constructor(subscriber: Subscriber) {
    super();
    this.setMaxListeners(3);
    this.#client = new Client(getConnectionString());
    this.#subscriber = subscriber;

    this.#setupListener();
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
    await this.#client.query(
      format(`unlisten "${this.#subscriber.streamCategory}|${this.#subscriber.name}"`),
    );

    this.removeAllListeners('domain-event' satisfies ChannelName);
    this.removeAllListeners('unknown-event' satisfies ChannelName);
    this.removeAllListeners('rebuild' satisfies ChannelName);
    await this.#client.end();
  }

  async listen() {
    this.#client.on('notification', (notification) => {
      try {
        const event = JSON.parse(notification.payload || '{}');

        if (!isEvent(event)) {
          getLogger().error(new Error('Notification payload is not an event'), {
            notification,
            subscriber: this.#subscriber,
          });
          return;
        }

        this.emit(this.#getChannelName(event.type), event);
      } catch (error) {
        getLogger().error(new Error('Unknown error'), {
          error,
        });
      }
    });

    await this.#client.query(
      format(`listen "${this.#subscriber.streamCategory}|${this.#subscriber.name}"`),
    );
  }

  #getChannelName(eventType: string): ChannelName {
    if (eventType === 'RebuildTriggered') {
      return 'rebuild';
    }

    if (this.#subscriber.eventType === 'all') {
      return 'domain-event';
    }

    const canHandleEvent = Array.isArray(this.#subscriber.eventType)
      ? this.#subscriber.eventType.includes(eventType)
      : eventType === this.#subscriber.eventType;

    return canHandleEvent ? 'domain-event' : 'unknown-event';
  }

  #setupListener() {
    this.#setupRebuildListener();
    this.#setupDomainEventListener();
    this.#setupUnknownEventListener();
  }

  #setupRebuildListener() {
    this.on('rebuild' satisfies ChannelName, async (event: Event & RebuildTriggered) => {
      try {
        getLogger().info('Rebuilding', {
          event,
          subscriber: this.#subscriber,
        });
        await rebuild(event, this.#subscriber);
        getLogger().info('Rebuilt', {
          event,
          subscriber: this.#subscriber,
        });
      } catch (error) {
        getLogger().error(new Error('Rebuild failed'), {
          error,
          event,
          subscriber: this.#subscriber,
        });
      } finally {
        await acknowledge({
          stream_category: this.#subscriber.streamCategory,
          subscriber_name: this.#subscriber.name,
          created_at: event.created_at,
          stream_id: event.stream_id,
          version: event.version,
        });
      }
    });
  }

  #setupDomainEventListener() {
    this.on('domain-event' satisfies ChannelName, async (event: Event) => {
      try {
        await this.#subscriber.eventHandler({
          type: event.type,
          payload: event.payload,
        } as DomainEvent);
        await acknowledge({
          stream_category: this.#subscriber.streamCategory,
          subscriber_name: this.#subscriber.name,
          created_at: event.created_at,
          stream_id: event.stream_id,
          version: event.version,
        });
      } catch (error) {
        getLogger().error(new Error('Handling domain event failed'), {
          error,
          event,
          subscriber: this.#subscriber,
        });
      }
    });
  }

  #setupUnknownEventListener() {
    this.on('unknown-event' satisfies ChannelName, async (event: Event) => {
      getLogger().warn('Unknown event', {
        event,
        subscriber: this.#subscriber,
      });
      try {
        await acknowledge({
          stream_category: this.#subscriber.streamCategory,
          subscriber_name: this.#subscriber.name,
          created_at: event.created_at,
          stream_id: event.stream_id,
          version: event.version,
        });
      } catch (error) {
        getLogger().error(new Error('Handling unknow event failed'), {
          error,
          event,
          subscriber: this.#subscriber,
        });
      }
    });
  }
}
