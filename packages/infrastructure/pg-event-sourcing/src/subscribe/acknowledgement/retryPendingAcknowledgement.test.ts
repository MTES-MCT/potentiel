import { describe, it, after, before, beforeEach } from 'node:test';

import { expect, should } from 'chai';

import { DomainEvent } from '@potentiel-domain/core';
import { executeQuery, killPool } from '@potentiel-libraries/pg-helpers';

import { registerSubscriber } from '../subscriber/registerSubscriber';
import { publish } from '../../publish/publish';

import { retryPendingAcknowledgement } from './retryPendingAcknowledgement';
import { getEventsWithPendingAcknowledgement } from './getEventsWithPendingAcknowledgement';

should();

describe('acknowledgement', () => {
  const streamCategory = 'category';
  const id = 'id';
  const subscriberName = 'subscriber';

  after(async () => {
    await killPool();
  });

  beforeEach(async () => {
    await executeQuery('delete from event_store.event_stream');
    await executeQuery('delete from event_store.subscriber');
    await executeQuery('delete from event_store.pending_acknowledgement');
  });

  before(async () => {
    process.env.DATABASE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';

    await executeQuery(
      'DROP RULE IF EXISTS prevent_delete_on_event_stream on event_store.event_stream',
    );
  });

  it(`
    Etant donnée des acknowledgements en attente correspondant à plusieurs événements
    Quand un subscriber tente de rejouer les événements en attente avec un event handler permettant de les traiter
    Alors aucuns acknowledgements correspondant à ces événements n'est en attente
  `, async () => {
    // Arrange
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
      name: subscriberName,
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
    expect(actuals.length).to.equal(0);
  });

  it(`
    Etant donnée des acknowledgements en attente correspondant à plusieurs événements
    Quand un subscriber tente de rejouer les événements en attente avec un event handler ne permettant pas d'en traiter certains
    Alors les acknowledgements sont en attente pour les événements à partir de celui n'ayant pas pu être traité
  `, async () => {
    // Arrange

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
      name: subscriberName,
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
    const actual = await getEventsWithPendingAcknowledgement(streamCategory, subscriberName);
    actual.length.should.be.equal(2);
    const [actual1, actual2] = actual;

    // Assert
    actual1.type.should.be.equal(event2.type);
    actual2.type.should.be.equal(event4.type);
    actual1.payload.should.be.deep.equal(event2.payload);
    actual2.payload.should.be.deep.equal(event4.payload);
  });
});
