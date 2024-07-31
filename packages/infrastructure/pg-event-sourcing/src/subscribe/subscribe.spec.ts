import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
  jest,
  expect,
} from '@jest/globals';
import waitForExpect from 'wait-for-expect';

import { executeQuery, executeSelect, killPool } from '@potentiel-libraries/pg-helpers';
import * as monitoring from '@potentiel-libraries/monitoring';

import { Event } from '../event';
import { publish } from '../publish/publish';

import { subscribe } from './subscribe';
import { registerSubscriber } from './subscriber/registerSubscriber';
import { getPendingAcknowledgements } from './acknowledgement/getPendingAcknowledgements';
import { getEventsWithPendingAcknowledgement } from './acknowledgement/getEventsWithPendingAcknowledgement';
import { executeRebuild } from './rebuild/executeRebuild';
import { NotificationPayloadParseError } from './errors/NotificationPayloadParse.error';
import { NotificationPayloadNotAnEventError } from './errors/NotificationPayloadNotAnEvent.error';
import { Unsubscribe } from './subscriber/subscriber';

describe(`subscribe`, () => {
  let unsubscribes: Array<Unsubscribe> = [];
  const error = jest.fn();
  const warn = jest.fn();

  afterEach(async () => {
    for (const unsubscribe of unsubscribes) {
      await unsubscribe();
    }

    unsubscribes = [];

    error.mockClear();
    warn.mockClear();
  });

  afterAll(async () => {
    await killPool();
  });

  beforeEach(async () => {
    await executeQuery(`delete from event_store.event_stream`);
    await executeQuery(`delete from event_store.subscriber`);
    await executeQuery(`delete from event_store.pending_acknowledgement`);

    jest.spyOn(monitoring, 'getLogger').mockReturnValue({
      debug: jest.fn(),
      error,
      info: jest.fn(),
      warn,
    });
  });

  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
    process.env.LOGGER_LEVEL = 'warn';
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
    const category = 'category';
    const id = 'id';
    const payload = {
      propriété: 'propriété',
    };

    const subscriberName1 = 'event-handler';
    const subscriberName2 = 'other-event-handler';

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

    const event1 = {
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
    Étant donné un event handler en attente du traitement d'un type d'événement
    Lorsqu'on émet un événement correspondant au type
    Et que l'event handler levé une exception
    Alors l'événement est en attente d'acknowledgement
  `, async () => {
    // Arrange
    const eventType = 'event-1';
    const category = 'category';
    const id = 'id';
    const payload = {
      propriété: 'propriété',
    };

    const subscriberName = 'event-handler';

    const unsubscribe = await subscribe({
      name: subscriberName,
      eventType: eventType,
      eventHandler: () => {
        throw new Error('An error');
      },
      streamCategory: category,
    });
    unsubscribes.push(unsubscribe);

    const event = {
      type: eventType,
      payload,
    };

    // Act
    await publish(`${category}|${id}`, event);

    await waitForExpect(async () => {
      // Assert
      const actuals = await getEventsWithPendingAcknowledgement(category, subscriberName);

      const events = [expect.objectContaining(event)];
      expect(actuals).toEqual(events);

      const actualAcknowledgements = await getPendingAcknowledgements('category', 'event-handler');
      expect(actualAcknowledgements.length).toBe(1);

      const expected = 'An error';

      expect(actualAcknowledgements[0].error).toEqual(expected);
    });
  });

  it(`
    Étant donné un event en attente d'acknowledgement
    Et un event handler en attente du traitement d'un type d'événement
    Lorsque que l'event handler souscrit au type d'event
    Alors l'event handler est exécuté
    Et il reçoit l'événement en paramétre
    Et il n'y a pas d'acknowledgement en attente pour cet événement après son traitement
  `, async () => {
    // Arrange
    const eventType = 'event-1';
    const category = 'category';
    const id = 'id';
    const payload = {
      propriété: 'propriété',
    };

    const subscriberName = 'event-handler';
    const eventHandler = jest.fn(() => Promise.resolve());

    await registerSubscriber({
      eventType,
      name: subscriberName,
      streamCategory: category,
    });

    const event = {
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
    Étant donné un event handler en attente du traitement d'un type d'événement ainsi que du type RebuildTriggered
    Et des événements précédement insérés dans le stream d'événement
    Lorsqu'on émet un événement de type RebuildTriggered pour le stream
    Alors l'event handler est exécuté avec l'événement RebuildTriggered
    Et il est ensuite exécuté avec l'ensemble des autres événements contenus dans le stream
    Et il n'y a pas d'acknowledgement en attente pour l'événement RebuildTriggered
  `, async () => {
    // Arrange
    const category = 'category';
    const id = 'id';

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

    await publish(`${category}|${id}`, event1, event2);

    const eventHandler = jest.fn(() => Promise.resolve());

    const unsubscribe1 = await subscribe({
      name: 'event-handler',
      eventType: ['event-1', 'event-2', 'RebuildTriggered'],
      eventHandler: eventHandler,
      streamCategory: category,
    });
    unsubscribes.push(unsubscribe1);

    // Act
    await executeRebuild(category, id);

    await waitForExpect(async () => {
      // Assert
      const rebuildTriggered = {
        type: 'RebuildTriggered',
        payload: {
          category,
          id,
        },
      };

      const expected = [
        [expect.objectContaining(rebuildTriggered)],
        [expect.objectContaining(event1)],
        [expect.objectContaining(event2)],
      ];

      expect(eventHandler.mock.calls).toEqual(expected);

      const actuals = await getPendingAcknowledgements(category, 'event-handler');

      expect(actuals.length).toBe(0);
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
    const category = 'category';
    const id = 'id';

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

    await publish(`${category}|${id}`, event1, event2);

    const eventHandler = jest.fn(() => Promise.resolve());

    const unsubscribe1 = await subscribe({
      name: 'event-handler',
      eventType: ['event-1', 'event-2', 'RebuildTriggered'],
      eventHandler: eventHandler,
      streamCategory: category,
    });
    unsubscribes.push(unsubscribe1);

    // Act
    await executeRebuild(category);

    await waitForExpect(async () => {
      // Assert
      const rebuildTriggered = {
        type: 'RebuildTriggered',
        payload: {
          category,
          id,
        },
      };

      const expected = [
        [expect.objectContaining(rebuildTriggered)],
        [expect.objectContaining(event1)],
        [expect.objectContaining(event2)],
      ];

      expect(eventHandler.mock.calls).toEqual(expected);

      const actuals = await getPendingAcknowledgements(category, 'event-handler');

      expect(actuals.length).toBe(0);
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
      expect(error).toHaveBeenCalledTimes(1);
      const param = error.mock.calls[0][0];

      expect(param).toBeInstanceOf(NotificationPayloadParseError);
      expect((param as Error).message).toBe('Notification payload parse error');
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
      // Assert
      expect(error).toHaveBeenCalledTimes(1);
      const param = error.mock.calls[0][0];

      expect(param).toBeInstanceOf(NotificationPayloadNotAnEventError);
      expect((param as Error).message).toBe('Notification payload is not an event');
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
      expect(warn).toHaveBeenCalledTimes(1);
      const param = warn.mock.calls[0][0];

      expect(param).toBe('Unknown event');
    });
  });

  it(`
    Lorsqu'on émet un événement
    Mais que le type de l'événement ne correspond à aucun subscriber
    Et il a acknowledgement en attente pour cet événement dans la dead letter queue
  `, async () => {
    // Arrange
    const category = 'category';
    const id = 'id';
    const payload = {
      propriété: 'propriété',
    };

    const event = {
      type: 'event-1',
      payload,
    };

    // Act
    await publish(`${category}|${id}`, event);

    await waitForExpect(async () => {
      // Assert
      const expected = [expect.objectContaining(event)];
      const actuals = await getEventsWithPendingAcknowledgement(category, 'dead-letter-queue');

      expect(actuals).toEqual(expect.arrayContaining(expected));
    });
  });
});
