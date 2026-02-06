import { describe, it, after, afterEach, before, beforeEach, mock } from 'node:test';

import { expect, should } from 'chai';
import waitForExpectLib from 'wait-for-expect';

import { executeQuery, executeSelect, killPool } from '@potentiel-libraries/pg-helpers';
import { initLogger } from '@potentiel-libraries/monitoring';
import { DomainEvent } from '@potentiel-domain/core';

import { Event } from '../event.js';
import { publish } from '../publish/publish.js';

import { executeSubscribersRetry, subscribe } from './subscribe.js';
import { getPendingAcknowledgements } from './acknowledgement/getPendingAcknowledgements.js';
import { executeRebuild } from './rebuild/executeRebuild.js';
import { Unsubscribe } from './subscriber/subscriber.js';
import { getEventsWithPendingAcknowledgement } from './acknowledgement/getEventsWithPendingAcknowledgement.js';
import { registerSubscriber } from './subscriber/registerSubscriber.js';

export const waitForExpect = waitForExpectLib.default;

should();

describe(`subscribe`, () => {
  const logMock = mock.fn();
  const streamCategory = 'category';
  const id = 'id';
  const subscriberName = 'subscriber';
  const subscriberName1 = 'subscriber-one';
  const subscriberName2 = 'subscriber-two';

  let unsubscribes: Array<Unsubscribe> = [];

  afterEach(async () => {
    for (const unsubscribe of unsubscribes) {
      await unsubscribe();
    }

    unsubscribes = [];

    logMock.mock.resetCalls();
  });

  after(async () => {
    await killPool();
  });

  beforeEach(async () => {
    await executeQuery('delete from event_store.event_stream');
    await executeQuery('delete from event_store.subscriber');
    await executeQuery('delete from event_store.pending_acknowledgement');
  });

  before(async () => {
    initLogger({ debug: logMock, error: logMock, info: logMock, warn: logMock });

    process.env.DATABASE_CONNECTION_STRING = 'postgres://potentiel@localhost:5433/potentiel';
    process.env.LOGGER_LEVEL = 'warn';

    await executeQuery(
      'DROP RULE IF EXISTS prevent_delete_on_event_stream on event_store.event_stream',
    );
  });

  it(`
    Étant donné un event handler en attente du traitement d'un type d'événement
    Lorsqu'on émet un événement correspondant au type
    Alors l'event handler est exécuté
    Et il reçoit l'événement en paramétre
    Et il n'y a pas d'acknowledgement en attente pour cet événement après son traitement
  `, async () => {
    // Arrange
    const eventType = 'event-1';
    const payload = {
      propriété: 'propriété',
    };

    let eventHandler1HasBeenCalled = false;
    let eventHandler2HasBeenCalled = false;
    const eventHandler1 = async (event: { type: string }) => {
      eventHandler1HasBeenCalled = event.type === eventType;
      return Promise.resolve();
    };
    const eventHandler2 = async (event: { type: string }) => {
      eventHandler2HasBeenCalled = event.type === eventType;
      return Promise.resolve();
    };

    const unsubscribe1 = await subscribe({
      name: subscriberName1,
      eventType: eventType,
      eventHandler: eventHandler1,
      streamCategory,
    });
    unsubscribes.push(unsubscribe1);

    const unsubscribe2 = await subscribe({
      name: subscriberName2,
      eventType: eventType,
      eventHandler: eventHandler2,
      streamCategory,
    });
    unsubscribes.push(unsubscribe2);

    const event1 = {
      type: eventType,
      payload,
    };

    // Act
    await publish(`${streamCategory}|${id}`, event1);

    await waitForExpect(async () => {
      // Assert
      eventHandler1HasBeenCalled.should.be.true;
      eventHandler2HasBeenCalled.should.be.true;

      const actuals = [
        ...(await getPendingAcknowledgements(streamCategory, subscriberName1)),
        ...(await getPendingAcknowledgements(streamCategory, subscriberName2)),
      ];

      actuals.length.should.be.equal(0);
    });
  });

  it(`
    Étant donné un event handler en attente du traitement d'un type d'événement
    Lorsqu'on émet un événement correspondant au type
    Et que l'event handler levé une exception
    Alors l'événement est en attente d'acknowledgement
  `, async () => {
    // Arrange
    const eventType = 'event-1';
    const payload = {
      propriété: 'propriété',
    };

    const unsubscribe = await subscribe({
      name: subscriberName,
      eventType: eventType,
      eventHandler: () => {
        throw new Error('An error');
      },
      streamCategory,
    });
    unsubscribes.push(unsubscribe);

    const event = {
      type: eventType,
      payload,
    };

    // Act
    await publish(`${streamCategory}|${id}`, event);

    await waitForExpect(async () => {
      // Assert
      const actual = await getEventsWithPendingAcknowledgement(streamCategory, subscriberName);
      actual.length.should.be.equal(1);

      const [actual1] = actual;

      actual1.type.should.be.equal(event.type);
      actual1.payload.should.be.deep.equal(event.payload);

      const actualAcknowledgements = await getPendingAcknowledgements('category', subscriberName);
      actualAcknowledgements.length.should.be.equal(1);

      const expected = 'An error';

      expect(actualAcknowledgements[0].error).to.equal(expected);
    });
  });

  it(`
    Étant donné un event en attente d'acknowledgement
    Et un event handler en attente du traitement d'un type d'événement
    Lorsque que l'on traite les events en attente
    Alors l'event handler est exécuté
    Et il reçoit l'événement en paramétre
    Et il n'y a pas d'acknowledgement en attente pour cet événement après son traitement
  `, async () => {
    // Arrange
    const eventType = 'event-1';
    const payload = {
      propriété: 'propriété',
    };

    let eventHandlerHasBeenCalled = false;
    const eventHandler = async (event: { type: string }) => {
      eventHandlerHasBeenCalled = event.type === eventType;
      return Promise.resolve();
    };

    await registerSubscriber({
      eventType,
      name: subscriberName,
      streamCategory,
    });

    const event = {
      type: eventType,
      payload,
    };

    await publish(`${streamCategory}|${id}`, event);

    const unsubscribe = await subscribe({
      name: subscriberName,
      eventType,
      eventHandler,
      streamCategory,
    });
    unsubscribes.push(unsubscribe);

    // Act
    await executeSubscribersRetry();

    eventHandlerHasBeenCalled.should.be.true;

    const actuals = await getPendingAcknowledgements(streamCategory, subscriberName);
    actuals.length.should.be.equal(0);
  });

  it(`
    Étant donné un event handler en attente du traitement d'un type d'événement ainsi que du type RebuildTriggered
    Et des événements précédement insérés dans le stream d'événement
    Lorsqu'on émet un événement de type RebuildTriggered pour le stream
    Alors l'event handler est exécuté avec l'événement RebuildTriggered
    Et il est ensuite exécuté avec l'ensemble des autres événements contenus dans le stream
    Et il n'y a pas d'acknowledgement en attente pour l'événement RebuildTriggered
  `, async () => {
    // Arrange
    const event1 = {
      type: 'event-1',
      payload: {
        propriété: 'propriété1',
      },
    };

    const event2 = {
      type: 'event-1',
      payload: {
        propriété: 'propriété2',
      },
    };

    await publish(`${streamCategory}|${id}`, event1, event2);

    const eventCalls: Array<DomainEvent> = [];
    const eventHandler = async (event: DomainEvent) => {
      eventCalls.push(event);
      return Promise.resolve();
    };

    const unsubscribe1 = await subscribe({
      name: subscriberName,
      eventType: ['event-1', 'event-2', 'RebuildTriggered'],
      eventHandler: eventHandler,
      streamCategory,
    });
    unsubscribes.push(unsubscribe1);

    // Act
    await executeRebuild(streamCategory, id);

    await waitForExpect(async () => {
      // Assert
      const rebuildTriggered = {
        type: 'RebuildTriggered',
        payload: {
          category: streamCategory,
          id,
        },
      };

      const [actual1, actual2, actual3] = eventCalls;

      actual1.type.should.be.equal(rebuildTriggered.type);
      actual1.payload.should.be.deep.equal(rebuildTriggered.payload);
      actual2.type.should.be.equal(event1.type);
      actual2.payload.should.be.deep.equal(event1.payload);
      actual3.type.should.be.equal(event2.type);
      actual3.payload.should.be.deep.equal(event2.payload);

      const actuals = await getPendingAcknowledgements(streamCategory, 'event-handler');

      actuals.length.should.be.equal(0);
    });
  });

  it(`
    Étant donné un event handler en attente du traitement d'un type d'événement ainsi que du type RebuildTriggered
    Et des événements précédement insérés dans le stream d'événement
    Lorsqu'on émet un événement de type RebuildTriggered pour la catégorie du stream
    Alors l'event handler est exécuté avec l'événement RebuildTriggered
    Et il est ensuite exécuté avec l'ensemble des autres événements contenu dans le stream
    Et il n'y a pas d'acknowledgement en attente pour l'événement RebuildTriggered
  `, async () => {
    // Arrange
    const event1 = {
      type: 'event-1',
      payload: {
        propriété: 'propriété1',
      },
    };

    const event2 = {
      type: 'event-1',
      payload: {
        propriété: 'propriété2',
      },
    };

    await publish(`${streamCategory}|${id}`, event1, event2);

    const eventCalls: Array<DomainEvent> = [];
    const eventHandler = async (event: DomainEvent) => {
      eventCalls.push(event);
      return Promise.resolve();
    };

    const unsubscribe1 = await subscribe({
      name: subscriberName,
      eventType: ['event-1', 'event-2', 'RebuildTriggered'],
      eventHandler,
      streamCategory,
    });
    unsubscribes.push(unsubscribe1);

    // Act
    await executeRebuild(streamCategory);

    await waitForExpect(async () => {
      // Assert
      const rebuildTriggered = {
        type: 'RebuildTriggered',
        payload: {
          category: streamCategory,
        },
      };

      const [actual1, actual2, actual3] = eventCalls;

      actual1.type.should.be.equal(rebuildTriggered.type);
      actual1.payload.should.be.deep.equal(rebuildTriggered.payload);
      actual2.type.should.be.equal(event1.type);
      actual2.payload.should.be.deep.equal(event1.payload);
      actual3.type.should.be.equal(event2.type);
      actual3.payload.should.be.deep.equal(event2.payload);

      const actuals = await getPendingAcknowledgements(streamCategory, 'event-handler');

      actuals.length.should.be.equal(0);
    });
  });

  it(`
    Quand une notification est publiée
    Mais que le payload n'est pas un json valide
    Alors une erreur est loggé
  `, async () => {
    // Arrange
    const category = 'category';
    const subscriberName = 'event-handler';

    await registerSubscriber({
      eventType: 'event-1',
      name: subscriberName,
      streamCategory: category,
    });

    // Act
    const unsubscribe = await subscribe({
      name: subscriberName,
      eventType: 'event-1',
      eventHandler: () => Promise.resolve(),
      streamCategory: category,
    });
    unsubscribes.push(unsubscribe);

    await executeSelect(
      'select pg_notify($1, $2)',
      `${category}|${subscriberName}`,
      `this is not a valid json ';..;'`,
    );

    await waitForExpect(async () => {
      // Assert
      expect(logMock.mock.callCount()).to.eq(1);
      expect(logMock.mock.calls[0].arguments[0]).to.contain('Notification payload parse error');
    });
  });

  it(`
    Quand une notification est publiée
    Mais que le payload ne correspond pas à celui d'un event
    Alors une erreur est loggé
  `, async () => {
    // Arrange
    const category = 'category';
    const subscriberName = 'event-handler';

    await registerSubscriber({
      eventType: 'event-1',
      name: subscriberName,
      streamCategory: category,
    });

    // Act
    const unsubscribe = await subscribe({
      name: subscriberName,
      eventType: 'event-1',
      eventHandler: () => Promise.resolve(),
      streamCategory: category,
    });
    unsubscribes.push(unsubscribe);

    await executeSelect('select pg_notify($1, $2)', `${category}|${subscriberName}`, {});

    await waitForExpect(async () => {
      expect(logMock.mock.callCount()).to.eq(1);
      expect(logMock.mock.calls[0].arguments[0]).to.contain('Notification payload is not an event');
    });
  });

  it(`
    Quand une notification est publiée
    Et que le payload correspond à celui d'un événement
    Et que l'événement est envoyé à un subscriber qui ne correspondant pas au type de l'événement
    Alors un warning est loggé
  `, async () => {
    // Arrange
    const category = 'category';
    const subscriberName = 'event-handler';

    await registerSubscriber({
      eventType: 'event-1',
      name: subscriberName,
      streamCategory: category,
    });

    // Act
    const unsubscribe = await subscribe({
      name: subscriberName,
      eventType: 'event-1',
      eventHandler: () => Promise.resolve(),
      streamCategory: category,
    });
    unsubscribes.push(unsubscribe);

    const event: Event = {
      created_at: new Date().toISOString(),
      payload: {},
      stream_id: 'category|id',
      type: 'unknown type for the handler',
      version: 1,
    };

    await executeSelect('select pg_notify($1, $2)', `${category}|${subscriberName}`, event);

    await waitForExpect(async () => {
      // Assert
      expect(logMock.mock.callCount()).to.eq(1);
      expect(logMock.mock.calls[0].arguments[0]).to.contain('Unknown event');
    });
  });

  it(`
    Lorsqu'on émet un événement
    Mais que le type de l'événement ne correspond à aucun subscriber
    Et il a acknowledgement en attente pour cet événement dans la dead letter queue
  `, async () => {
    // Arrange
    const payload = {
      propriété: 'propriété',
    };

    const event = {
      type: 'event-1',
      payload,
    };

    // Act
    await publish(`${streamCategory}|${id}`, event);

    await waitForExpect(async () => {
      // Assert
      const actuals = await getEventsWithPendingAcknowledgement(
        streamCategory,
        'dead-letter-queue',
      );

      actuals.length.should.be.equal(1);

      const [actual1] = actuals;

      actual1.type.should.be.equal(event.type);
      actual1.payload.should.be.deep.equal(event.payload);
    });
  });

  it(`
    Étant donné un event handler en attente du traitement d'un type d'événement
    Lorsque la connexion au client est interrompue
    Et qu'on émet un événement correspondant au type
    Alors l'event handler est exécuté
    Et il reçoit l'événement en paramétre
    Et il n'y a pas d'acknowledgement en attente pour cet événement après son traitement
  `, async () => {
    // Arrange
    const eventType = 'event-1';
    const payload = {
      propriété: 'propriété',
    };

    let eventHandler1HasBeenCalled = false;
    let eventHandler2HasBeenCalled = false;
    const eventHandler1 = async (event: { type: string }) => {
      eventHandler1HasBeenCalled = event.type === eventType;
      return Promise.resolve();
    };
    const eventHandler2 = async (event: { type: string }) => {
      eventHandler2HasBeenCalled = event.type === eventType;
      return Promise.resolve();
    };

    const unsubscribe1 = await subscribe({
      name: subscriberName1,
      eventType: eventType,
      eventHandler: eventHandler1,
      streamCategory,
    });
    unsubscribes.push(unsubscribe1);

    const unsubscribe2 = await subscribe({
      name: subscriberName2,
      eventType: eventType,
      eventHandler: eventHandler2,
      streamCategory,
    });
    unsubscribes.push(unsubscribe2);

    const event1 = {
      type: eventType,
      payload,
    };

    // Act
    await disconnectAllSubscriberClients();
    await publish(`${streamCategory}|${id}`, event1);

    await waitForExpect(async () => {
      // Assert
      eventHandler1HasBeenCalled.should.be.true;
      eventHandler2HasBeenCalled.should.be.true;

      const actuals = [
        ...(await getPendingAcknowledgements(streamCategory, subscriberName1)),
        ...(await getPendingAcknowledgements(streamCategory, subscriberName2)),
      ];

      actuals.length.should.be.equal(0);
    });
  });
});

const disconnectAllSubscriberClients = () =>
  executeQuery(`
  SELECT pg_terminate_backend(pid)
  FROM pg_stat_activity
  WHERE usename = 'potentiel'
  AND   query LIKE 'listen%'`);
