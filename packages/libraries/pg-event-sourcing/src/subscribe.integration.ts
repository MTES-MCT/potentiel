import { Subscriber } from '@potentiel/core-domain';
import { getConnectionString } from '@potentiel/pg-helpers';
import { subscribe } from './subscribe';
import { Client } from 'pg';

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
      name: 'eventHandler',
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
      ['eventHandler'],
    );
    await client.end();

    await unsubscribe();

    const expected = {
      subscriber_id: 'eventHandler',
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
      name: 'eventHandler',
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
      ['eventHandler'],
    );
    await client.end();

    await unsubscribe();

    const expected = {
      subscriber_id: 'eventHandler',
      filter: null,
    };

    expect(actual.rows[0]).toEqual(expected);
  });

  // it(`
  //   Étant donnée un event handler à l'écoute d'un type d'événement
  //   Lorsqu'on emet un évènement
  //   Alors l'event handler est éxècuté
  //   Et il reçoit l'évènement en paramêtre
  // `, async () => {
  //   const createdAt = new Date().toISOString();
  //   const payload = {
  //     propriété: 'propriété',
  //   };

  //   // Arrange
  //   const eventHandler = jest.fn(() => Promise.resolve());
  //   const unsubscribe = await subscribe(eventType, eventHandler);

  //   const client = new Client(getConnectionString());
  //   await client.connect();
  //   await client.query(
  //     `
  //       insert
  //       into event_store.event_stream
  //       values (
  //         $1,
  //         $2,
  //         $3,
  //         $4,
  //         $5
  //       )`,
  //     [streamId, createdAt, eventType, version, payload],
  //   );
  //   await client.end();

  //   await unsubscribe();

  //   await waitForExpect(() => {
  //     // Assert
  //     const expected: DomainEvent = {
  //       type: eventType,
  //       payload,
  //     };

  //     expect(eventHandler).toHaveBeenCalledWith(expect.objectContaining(expected));
  //   });
  // });
});
