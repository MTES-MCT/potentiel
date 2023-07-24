import { DomainEvent, DomainEventHandler } from '@potentiel/core-domain';
import { getConnectionString } from '@potentiel/pg-helpers';
import { Event } from './event';
import { subscribe } from './subscribe';
import waitForExpect from 'wait-for-expect';
import { Client } from 'pg';

describe(`subscribe`, () => {
  it(`Étant donnée un DomainEventHandler à l'écoute d'un type d'événement
      Lorsqu'on emet un évènement
      Alors le DomainEventHandle est éxècuté
      Et il reçoit l'évènement en paramêtre`, async () => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';

    const eventType = 'event-1';
    const streamId = 'string#string';
    const version = 1;
    const createdAt = new Date().toISOString();
    const payload = {
      propriété: 'propriété',
    };

    // Arrange
    const client = new Client(getConnectionString());
    await client.connect();
    await client.query(`delete from event_store.event_stream`);
    await client.query(`insert into event_store.subscriber values($1)`, ['new_event']);

    const domainEventHandler: DomainEventHandler<Event> = jest.fn(() => Promise.resolve());
    const unsubscribe = await subscribe(eventType, domainEventHandler);

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
    await unsubscribe();

    await waitForExpect(() => {
      // Assert
      const expected: DomainEvent = {
        type: eventType,
        payload,
      };

      expect(domainEventHandler).toHaveBeenCalledWith(expect.objectContaining(expected));
    });
  });
});

export const sleep = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};
