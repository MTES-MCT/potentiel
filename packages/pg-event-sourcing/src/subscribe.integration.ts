import { DomainEvent, DomainEventHandler, Unsubscribe } from '@potentiel/core-domain';
import { executeQuery } from '@potentiel/pg-helpers';
import { Event } from './event';
import { subscribe } from './subscribe';
import waitForExpect from 'wait-for-expect';

describe(`subscribe`, () => {
  let unsubscribe: Unsubscribe;

  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  beforeEach(() => executeQuery(`DELETE FROM "EVENT_STREAM"`));

  afterEach(() => unsubscribe());

  it(`Étant donnée un DomainEventHandler à l'écoute d'un type d'événement
      Lorsqu'on emet un évènement
      Alors le DomainEventHandle est éxècuté
      Et il reçoit l'évènement en paramêtre`, async () => {
    const eventType = 'event-1';
    const streamId = 'string#string';
    const version = 1;
    const createdAt = new Date().toISOString();
    const payload = {
      propriété: 'propriété',
    };

    // Arrange
    const domainEventHandler: DomainEventHandler<Event> = jest.fn(() => Promise.resolve());
    unsubscribe = await subscribe(eventType, domainEventHandler);

    // Act
    await executeQuery(
      `INSERT 
       INTO "EVENT_STREAM" (
        "streamId", 
        "createdAt", 
        "type", 
        "version", 
        "payload"
        ) 
       VALUES (
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
