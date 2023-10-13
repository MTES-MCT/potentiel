import { describe, it, expect, afterAll, beforeEach, beforeAll } from '@jest/globals';
import { DomainEvent } from '@potentiel/core-domain';
import { executeQuery, killPool } from '@potentiel/pg-helpers';
import { registerSubscriber } from '../subscriber/registerSubscriber';
import { publish } from '../../publish/publish';
import { retryPendingAcknowledgement } from './retryPendingAcknowledgement';
import { getEventsWithPendingAcknowledgement } from './getEventsWithPendingAcknowledgement';

describe('acknowledgement', () => {
  afterAll(async () => {
    await killPool();
  });

  beforeEach(async () => {
    await executeQuery(`delete from event_store.event_stream`);
    await executeQuery(`delete from event_store.subscriber`);
    await executeQuery(`delete from event_store.pending_acknowledgement`);
  });

  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  it(`
    Etant donnée des acknowledgements en attente correspondant à plusieurs événements
    Quand un subscriber tente de rejouer les événements en attente avec un event handler permettant de les traiter
    Alors aucuns acknowledgements correspondant à ces événements n'est en attente
  `, async () => {
    // Arrange
    const subscriberName = 'subscriber';
    const streamCategory = 'category';
    const id = 'id';

    const event1: DomainEvent = {
      type: 'event-1',
      payload: { test1: '1' },
    };

    const event2: DomainEvent = {
      type: 'event-2',
      payload: { test2: '2' },
    };

    const event3: DomainEvent = {
      type: 'event-3',
      payload: { test3: '2' },
    };

    await registerSubscriber({
      eventType: ['event-1', 'event-2'],
      name: 'subscriber',
      streamCategory,
    });

    await publish(`${streamCategory}|${id}`, event1, event2, event3);

    await retryPendingAcknowledgement({
      streamCategory,
      name: subscriberName,
      eventHandler: () => {
        return Promise.resolve();
      },
      eventType: ['event-1', 'event-2'],
    });

    // Act
    const actuals = await getEventsWithPendingAcknowledgement(streamCategory, subscriberName);

    // Assert
    expect(actuals.length).toBe(0);
  });

  it(`
    Etant donnée des acknowledgements en attente correspondant à plusieurs événements
    Quand un subscriber tente de rejouer les événements en attente avec un event handler ne permettant pas d'en traiter certains
    Alors les acknowledgements sont en attente pour les événements à partir de celui n'ayant pas pu être traité
  `, async () => {
    // Arrange
    const subscriberName = 'subscriber';
    const streamCategory = 'category';
    const id = 'id';

    const event1: DomainEvent = {
      type: 'event-1',
      payload: { test1: '1' },
    };

    const event2: DomainEvent = {
      type: 'event-2',
      payload: { test2: '2' },
    };

    const event3: DomainEvent = {
      type: 'event-3',
      payload: { test3: '3' },
    };

    const event4: DomainEvent = {
      type: 'event-4',
      payload: { test4: '4' },
    };

    await registerSubscriber({
      eventType: ['event-1', 'event-2', 'event-4'],
      name: 'subscriber',
      streamCategory,
    });

    await publish(`${streamCategory}|${id}`, event1, event2, event3, event4);

    await retryPendingAcknowledgement({
      streamCategory,
      name: subscriberName,
      eventHandler: ({ type }) => {
        if (type === 'event-2') throw new Error();
        return Promise.resolve();
      },
      eventType: ['event-1', 'event-2', 'event-4'],
    });

    // Act
    const actuals = await getEventsWithPendingAcknowledgement(streamCategory, subscriberName);

    // Assert
    const events = [expect.objectContaining(event2), expect.objectContaining(event4)];
    expect(actuals).toEqual(events);
  });
});
