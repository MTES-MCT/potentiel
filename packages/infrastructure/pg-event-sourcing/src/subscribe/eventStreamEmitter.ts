import { EventEmitter } from 'events';

import type { Client } from 'pg';
import format from 'pg-format';

import type { DomainEvent } from '@potentiel-domain/core';
import { getLogger, type Logger } from '@potentiel-libraries/monitoring';

import { type Event, isEvent } from '../event.js';
import { acknowledge, acknowledgeError } from './acknowledgement/acknowledge.js';
import { DomainEventHandlingFailedError } from './errors/DomainEventHandlingFailed.error.js';
import { NotificationPayloadNotAnEventError } from './errors/NotificationPayloadNotAnEvent.error.js';
import { NotificationPayloadParseError } from './errors/NotificationPayloadParse.error.js';
import { RebuildFailedError } from './errors/RebuildFailed.error.js';
import { UnknownEventHandlingFailedError } from './errors/UnknownEventHandlingFailed.error.js';
import { rebuild } from './rebuild/rebuild.js';
import { rebuildAll } from './rebuild/rebuildAll.js';
import { isRebuildAllEvent, type RebuildTriggered } from './rebuild/rebuildTriggered.event.js';
import { getPayloadTooLarge, isPayloadTooLargeEvent } from './subscriber/getPayloadTooLarge.js';
import type { Subscriber } from './subscriber/subscriber.js';

type ChannelName = 'rebuild' | 'domain-event' | 'unknown-event';

export class EventStreamEmitter<TEvent extends DomainEvent = DomainEvent> extends EventEmitter {
  #client: Client;
  #subscriber: Subscriber<TEvent>;
  #logger: Logger;

  constructor(client: Client, subscriber: Subscriber<TEvent>) {
    super();
    this.setMaxListeners(3);
    this.#logger = getLogger(
      `EventStreamEmitter - ${subscriber.streamCategory} - ${subscriber.name}`,
    );
    this.#subscriber = subscriber;
    this.#client = client;

    this.#setupListener();
  }

  public get subscriber(): Subscriber<TEvent> {
    return this.#subscriber;
  }

  async unlisten() {
    await this.#client.query(
      format(`unlisten "${this.#subscriber.streamCategory}|${this.#subscriber.name}"`),
    );

    this.removeAllListeners('domain-event' satisfies ChannelName);
    this.removeAllListeners('unknown-event' satisfies ChannelName);
    this.removeAllListeners('rebuild' satisfies ChannelName);
  }

  async listen() {
    this.#client.on('notification', async (notification) => {
      /*
        Le client pg est partagé entre tous les EventStreamEmitters.
        Chacun reçoit toutes les notifications, on filtre donc sur le channel propre à ce subscriber
      */
      if (notification.channel !== `${this.#subscriber.streamCategory}|${this.#subscriber.name}`) {
        return;
      }

      try {
        const event = await this.#parseEvent(notification.payload ?? '{}');
        this.emit(this.#getChannelName(event.type), event);
      } catch (error) {
        this.#logger.error(new NotificationPayloadParseError(error), {
          notification,
          subscriberName: this.#subscriber.name,
          streamCategory: this.#subscriber.streamCategory,
        });
      }
    });

    await this.#client.query(
      format(`listen "${this.#subscriber.streamCategory}|${this.#subscriber.name}"`),
    );
  }

  async updateClient(client: Client) {
    this.#client = client;

    await this.unlisten();
    this.#setupListener();
    await this.listen();
  }

  #getChannelName(eventType: string): ChannelName {
    if (eventType === 'RebuildTriggered' || eventType === 'RebuildAllTriggered') {
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
        this.#logger.info('Rebuilding', {
          event,
          subscriber: this.#subscriber,
        });
        if (isRebuildAllEvent(event)) {
          await rebuildAll<TEvent>(event, this.#subscriber);
        } else {
          await rebuild<TEvent>(event, this.#subscriber);
          this.#logger.info('Rebuilt', { streamId: event.stream_id });
        }
      } catch (error) {
        if (error instanceof RebuildFailedError) {
          this.#logger.error(error, {
            event: error.event ?? event,
            subscriberName: this.#subscriber.name,
            category: this.#subscriber.streamCategory,
          });
        } else {
          this.#logger.error(new RebuildFailedError(error), {
            event,
            subscriberName: this.#subscriber.name,
            category: this.#subscriber.streamCategory,
          });
        }
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
    this.on('domain-event' satisfies ChannelName, async (event: TEvent & Event) => {
      try {
        await this.#subscriber.eventHandler(event);
        await acknowledge({
          stream_category: this.#subscriber.streamCategory,
          subscriber_name: this.#subscriber.name,
          created_at: event.created_at,
          stream_id: event.stream_id,
          version: event.version,
        });
      } catch (error) {
        this.#logger.error(new DomainEventHandlingFailedError(error), {
          event,
          subscriber: this.#subscriber,
        });
        await acknowledgeError(
          {
            stream_category: this.#subscriber.streamCategory,
            subscriber_name: this.#subscriber.name,
            created_at: event.created_at,
            stream_id: event.stream_id,
            version: event.version,
          },
          error as Error,
        );
      }
    });
  }

  #setupUnknownEventListener() {
    this.on('unknown-event' satisfies ChannelName, async (event: Event) => {
      this.#logger.warn('Unknown event', {
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
        this.#logger.error(new UnknownEventHandlingFailedError(error), {
          event,
          subscriber: this.#subscriber,
        });
      }
    });
  }

  async #parseEvent(rawEvent: string): Promise<Event> {
    const parsedEvent = JSON.parse(rawEvent);

    if (!isEvent(parsedEvent)) {
      throw new NotificationPayloadNotAnEventError();
    }

    /**
     * Si l'event est flaggé comme ayant un payload trop large alors on va le chercher en db
     * et c'est cet event (contenant le bon payload), qui est emit
     */
    if (isPayloadTooLargeEvent(parsedEvent)) {
      return {
        ...parsedEvent,
        payload: await getPayloadTooLarge<TEvent>(parsedEvent),
      };
    }

    return parsedEvent;
  }
}
