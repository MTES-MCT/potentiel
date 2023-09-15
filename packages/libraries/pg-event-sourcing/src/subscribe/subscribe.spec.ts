import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { DomainEvent, Unsubscribe } from '@potentiel/core-domain';
import { executeQuery, killPool } from '@potentiel/pg-helpers';
import { subscribe } from './subscribe';
import waitForExpect from 'wait-for-expect';
import { publish } from '../publish/publish';
import { getPendingAcknowledgements } from './acknowledgement/getPendingAcknowledgements';
import { registerSubscriber } from './subscriber/registerSubscription';

describe(`subscribe`, () => {
  let unsubscribes: Array<Unsubscribe> = [];

  afterEach(async () => {
    for (const unsubscribe of unsubscribes) {
      await unsubscribe();
    }

    unsubscribes = [];
  });

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
    Étant donnée un event handler en attente du traitement d'un type d'événement
    Lorsqu'on emet un évènement correspondant au type
    Alors l'event handler est éxècuté
    Et il reçoit l'évènement en paramêtre
    Et il n'y a pas d'acknowledgement en attente pour cet événement aprés son traitement
  `, async () => {
    // Arrange
    const eventType = 'event-1';
    const category = 'category';
    const id = 'id';
    const payload = {
      propriété: 'propriété',
    };

    const subscriberName1 = 'event_handler';
    const subscriberName2 = 'other_event_handler';

    const eventHandler1 = jest.fn(() => Promise.resolve());
    const eventHandler2 = jest.fn(() => Promise.resolve());

    const unsubscribe1 = await subscribe({
      name: subscriberName1,
      eventType: eventType,
      eventHandler: eventHandler1,
      streamCategory: category,
    });
    unsubscribes.push(unsubscribe1);

    const unsubscribe2 = await subscribe({
      name: subscriberName2,
      eventType: eventType,
      eventHandler: eventHandler2,
      streamCategory: category,
    });
    unsubscribes.push(unsubscribe2);

    const event1: DomainEvent = {
      type: eventType,
      payload,
    };

    // Act
    await publish(`${category}|${id}`, event1);

    await waitForExpect(async () => {
      // Assert
      expect(eventHandler1).toHaveBeenCalledWith(expect.objectContaining(event1));
      expect(eventHandler2).toHaveBeenCalledWith(expect.objectContaining(event1));

      const actuals = [
        ...(await getPendingAcknowledgements(category, subscriberName1)),
        ...(await getPendingAcknowledgements(category, subscriberName2)),
      ];

      expect(actuals.length).toBe(0);
    });
  });

  it(`
    Étant donnée un event en attente d'acknowledgement
    Et un event handler en attente du traitement d'un type d'événement
    Lorsque que l'event handler souscrit au type d'event
    Alors l'event handler est éxècuté
    Et il reçoit l'évènement en paramêtre
    Et il n'y a pas d'acknowledgement en attente pour cet événement aprés son traitement
  `, async () => {
    // Arrange
    const eventType = 'event-1';
    const category = 'category';
    const id = 'id';
    const payload = {
      propriété: 'propriété',
    };

    const subscriberName = 'event_handler';
    const eventHandler = jest.fn(() => Promise.resolve());

    await registerSubscriber({
      eventType,
      name: subscriberName,
      streamCategory: category,
    });

    const event: DomainEvent = {
      type: eventType,
      payload,
    };

    await publish(`${category}|${id}`, event);

    // Act
    const unsubscribe = await subscribe({
      name: subscriberName,
      eventType,
      eventHandler,
      streamCategory: category,
    });
    unsubscribes.push(unsubscribe);

    expect(eventHandler).toHaveBeenCalledWith(expect.objectContaining(event));

    const actuals = await getPendingAcknowledgements(category, subscriberName);

    expect(actuals.length).toBe(0);
  });

  it(`
    Lorsqu'un notification est publiée
    Mais qu'elle ne correspond pas à un événement
    Alors une erreur est loggé
  `, async () => {
    // Arrange
    const eventType = 'event-1';
    const category = 'category';
    const id = 'id';
    const payload = {
      propriété: 'propriété',
    };

    const subscriberName = 'event_handler';
    const eventHandler = jest.fn(() => Promise.resolve());

    await registerSubscriber({
      eventType,
      name: subscriberName,
      streamCategory: category,
    });

    const event: DomainEvent = {
      type: eventType,
      payload,
    };

    await publish(`${category}|${id}`, event);

    // Act
    const unsubscribe = await subscribe({
      name: subscriberName,
      eventType,
      eventHandler,
      streamCategory: category,
    });
    unsubscribes.push(unsubscribe);

    expect(eventHandler).toHaveBeenCalledWith(expect.objectContaining(event));

    const actuals = await getPendingAcknowledgements(category, subscriberName);

    expect(actuals.length).toBe(0);
  });
});
