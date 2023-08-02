import { DomainEvent, Subscriber } from '@potentiel/core-domain';
import { getConnectionString } from '@potentiel/pg-helpers';
import { subscribe } from './subscribe';
import waitForExpect from 'wait-for-expect';
import { Client } from 'pg';
import { WrongSubscriberNameError } from './errors/wrongSubscriberName.error';

describe(`subscribe`, () => {
  const eventType = 'event-1';
  const streamId = 'string#string';
  const version = 1;

  beforeEach(async () => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
    const client = new Client(getConnectionString());
    await client.connect();
    await client.query(`delete from event_store.event_stream`);
    await client.query(`delete from event_store.subscriber`);
    await client.end();
  });

  it(`
    Etant donnée un event handler
    Lorsque que l'event handler souscrit à un type d'event
    Alors la souscription est crée dans l'event store
  `, async () => {
    const eventHandler = jest.fn(() => Promise.resolve());
    const unsubscribe = await subscribe({
      name: 'event_handler',
      eventType,
      eventHandler,
    });

    const client = new Client(getConnectionString());
    await client.connect();
    const actual = await client.query<Subscriber>(
      `
        select subscriber_id, filter
        from event_store.subscriber
        where subscriber_id = $1
      `,
      ['event_handler'],
    );
    await client.end();

    await unsubscribe();

    const expected = {
      subscriber_id: 'event_handler',
      filter: [eventType],
    };

    expect(actual.rows[0]).toEqual(expected);
  });

  it(`
    Etant donnée un event handler
    Lorsque que l'event handler souscrit à tout les types d'event
    Alors la souscription est crée dans l'event store
  `, async () => {
    const eventHandler = jest.fn(() => Promise.resolve());
    const unsubscribe = await subscribe({
      name: 'event_handler',
      eventType: 'all',
      eventHandler,
    });

    const client = new Client(getConnectionString());
    await client.connect();
    const actual = await client.query<Subscriber>(
      `
        select subscriber_id, filter
        from event_store.subscriber
        where subscriber_id = $1
      `,
      ['event_handler'],
    );
    await client.end();

    await unsubscribe();

    const expected = {
      subscriber_id: 'event_handler',
      filter: null,
    };

    expect(actual.rows[0]).toEqual(expected);
  });

  it(`
    Etant donnée un event handler
    Lorsque que l'event handler souscrit à un type d'event
    Mais que le nom du subscriber n'est pas en lower_snake_case
    Alors une erreur est levée
  `, async () => {
    const eventHandler = jest.fn(() => Promise.resolve());
    const promise = subscribe({
      name: 'eventHandler',
      eventType,
      eventHandler,
    });

    await expect(promise).rejects.toBeInstanceOf(WrongSubscriberNameError);
  });

  it(`
    Étant donnée un event handler à l'écoute d'un type d'événement
    Lorsqu'on emet un évènement
    Alors l'event handler est éxècuté
    Et il reçoit l'évènement en paramêtre
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
    });
    const unsubscribe2 = await subscribe({
      name: 'other_event_handler',
      eventType,
      eventHandler: eventHandler2,
    });

    const client = new Client(getConnectionString());
    await client.connect();

    await client.query(
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
      [streamId, createdAt, eventType, version, payload],
    );
    await client.end();

    await unsubscribe1();
    await unsubscribe2();

    await waitForExpect(() => {
      // Assert
      const expected: DomainEvent = {
        type: eventType,
        payload,
      };

      expect(eventHandler1).toHaveBeenCalledWith(expect.objectContaining(expected));
      expect(eventHandler2).toHaveBeenCalledWith(expect.objectContaining(expected));
    });
  });
});
