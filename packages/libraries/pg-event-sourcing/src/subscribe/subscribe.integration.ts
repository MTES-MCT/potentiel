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
import { executeQuery, executeSelect, killPool } from '@potentiel/pg-helpers';
import { subscribe } from './subscribe';
import waitForExpect from 'wait-for-expect';

describe(`subscribe`, () => {
  const eventType = 'event-1';
  const streamId = 'category#id';
  const version = 1;

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
    Étant donnée un event handler à l'écoute d'un type d'événement
    Lorsqu'on emet un évènement
    Alors l'event handler est éxècuté
    Et il reçoit l'évènement en paramêtre
    Et il n'y a pas d'acknowledgement en attente dans l'event store
  `, async () => {
    const createdAt = new Date().toISOString();
    const payload = {
      propriété: 'propriété',
    };

    // Arrange
    const eventHandler1 = jest.fn(() => Promise.resolve());
    const eventHandler2 = jest.fn(() => Promise.resolve());
    const unsubscribe1 = await subscribe({
      name: 'event_handler',
      eventType,
      eventHandler: eventHandler1,
      streamCategory: 'category',
    });
    unsubscribes.push(unsubscribe1);

    const unsubscribe2 = await subscribe({
      name: 'other_event_handler',
      eventType,
      eventHandler: eventHandler2,
      streamCategory: 'category',
    });
    unsubscribes.push(unsubscribe2);

    await executeQuery(
      `
        insert
        into event_store.event_stream
        values (
          $1,
          $2,
          $3,
          $4,
          $5
        )`,
      streamId,
      createdAt,
      eventType,
      version,
      payload,
    );

    await waitForExpect(async () => {
      // Assert
      const expected: DomainEvent = {
        type: eventType,
        payload,
      };

      expect(eventHandler1).toHaveBeenCalledWith(expect.objectContaining(expected));
      expect(eventHandler2).toHaveBeenCalledWith(expect.objectContaining(expected));

      const data = await executeSelect(
        `
          select *
          from event_store.pending_acknowledgement
          where subscriber_id = any($1)`,
        ['event_handler', 'other_event_handler'],
      );

      expect(data.length).toBe(0);
    });
  });

  it(`
    Étant donnée un event en attente d'acknowledgement
    Et un event handler permettant de traiter cet event
    Lorsque que l'event handler souscrit au type d'event
    Alors l'event est traité par l'event handler
    Et l'event est ackowledge
  `, async () => {
    // Arrange
    const createdAt = new Date().toISOString();
    const payload = {
      propriété: 'propriété',
    };

    const eventHandler = jest.fn(() => Promise.resolve());

    await executeQuery(
      `
        insert
        into event_store.subscriber
        values ($1)`,
      'event_handler',
    );

    await executeQuery(
      `
        insert
        into event_store.event_stream
        values (
          $1,
          $2,
          $3,
          $4,
          $5
        )`,
      streamId,
      createdAt,
      eventType,
      version,
      payload,
    );

    const unsubscribe = await subscribe({
      name: 'event_handler',
      eventType,
      eventHandler,
      streamCategory: 'category',
    });
    unsubscribes.push(unsubscribe);

    // Act
    const expected: DomainEvent = {
      type: eventType,
      payload,
    };

    expect(eventHandler).toHaveBeenCalledWith(expect.objectContaining(expected));

    const subscribers = await executeSelect(
      `
        select *
        from event_store.pending_acknowledgement
        where subscriber_id = any($1)`,
      ['event_handler', 'other_event_handler'],
    );
    expect(subscribers.length).toBe(0);
  });
});
