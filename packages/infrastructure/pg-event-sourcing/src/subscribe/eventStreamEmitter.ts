import { EventEmitter } from 'events';

import { Client } from 'pg';
import format from 'pg-format';

import { getLogger } from '@potentiel-libraries/monitoring';

import { isEvent, Event } from '../event';

import { acknowledge, acknowledgeError } from './acknowledgement/acknowledge';
import { rebuild } from './rebuild/rebuild';
import { NotificationPayloadNotAnEventError } from './errors/NotificationPayloadNotAnEvent.error';
import { NotificationPayloadParseError } from './errors/NotificationPayloadParse.error';
import { RebuildFailedError } from './errors/RebuildFailed.error';
import { DomainEventHandlingFailedError } from './errors/DomainEventHandlingFailed.error';
import { UnknownEventHandlingFailedError } from './errors/UnknownEventHandlingFailed.error';
import { RebuildTriggered } from './rebuild/rebuildTriggered.event';
import { Subscriber } from './subscriber/subscriber';

type ChannelName = 'rebuild' | 'domain-event' | 'unknown-event';

export class EventStreamEmitter extends EventEmitter {
  #client: Client;
  #subscriber: Subscriber;

  constructor(client: Client, subscriber: Subscriber) {
    super();
    this.setMaxListeners(3);
    this.#subscriber = subscriber;
    this.#client = client;

    this.#setupListener();
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
    this.#client.on('notification', (notification) => {
      const logger = getLogger('Infrastructure.pg-event-sourcing.eventStreamEmitter.listen');
      try {
        const event = JSON.parse(notification.payload || '{}');

        if (!isEvent(event)) {
          logger.error(new NotificationPayloadNotAnEventError(), {
            notification,
            subscriber: this.#subscriber,
          });
          return;
        }

        if (
          notification.channel === `${this.#subscriber.streamCategory}|${this.#subscriber.name}`
        ) {
          this.emit(this.#getChannelName(event.type), event);
        }
      } catch (error) {
        logger.error(new NotificationPayloadParseError(error));
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
      const logger = getLogger(
        'Infrastructure.pg-event-sourcing.eventStreamEmitter.setupRebuildListener',
      );
      try {
        logger.info('Rebuilding', {
          event,
          subscriber: this.#subscriber,
        });
        await rebuild(event, this.#subscriber);
        logger.info('Rebuilt', {
          event,
          subscriber: this.#subscriber,
        });
      } catch (error) {
        logger.error(new RebuildFailedError(error), {
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
        await this.#subscriber.eventHandler(event);
        await acknowledge({
          stream_category: this.#subscriber.streamCategory,
          subscriber_name: this.#subscriber.name,
          created_at: event.created_at,
          stream_id: event.stream_id,
          version: event.version,
        });
      } catch (error) {
        getLogger(
          'Infrastructure.pg-event-sourcing.eventStreamEmitter.setupDomainEventListener',
        ).error(new DomainEventHandlingFailedError(error), {
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
      const logger = getLogger(
        'Infrastructure.pg-event-sourcing.eventStreamEmitter.setupUnknownEventListener',
      );
      logger.warn('Unknown event', {
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
        logger.error(new UnknownEventHandlingFailedError(error), {
          event,
          subscriber: this.#subscriber,
        });
      }
    });
  }
}
