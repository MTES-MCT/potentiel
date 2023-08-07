import { DomainEvent, Subscriber, Unsubscribe } from '@potentiel/core-domain';
import { executeQuery, executeSelect, killPool } from '@potentiel/pg-helpers';
import { subscribe } from './subscribe';
import { deleteAllSubscribers } from './deleteAllSubscribers';
import waitForExpect from 'wait-for-expect';
import { WrongSubscriberNameError } from './errors/wrongSubscriberName.error';

describe(`subscribe`, () => {
  const eventType = 'event-1';
  const streamId = 'string#string';
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
  });

  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
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
    unsubscribes.push(unsubscribe);

    const actual = await executeSelect<Subscriber>(
      `
        select subscriber_id, filter
        from event_store.subscriber
        where subscriber_id = $1
      `,
      'event_handler',
    );

    const expected = {
      subscriber_id: 'event_handler',
      filter: [eventType],
    };

    expect(actual[0]).toEqual(expected);
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
    unsubscribes.push(unsubscribe);

    const actual = await executeSelect<Subscriber>(
      `
        select subscriber_id, filter
        from event_store.subscriber
        where subscriber_id = $1
      `,
      'event_handler',
    );

    const expected = {
      subscriber_id: 'event_handler',
      filter: null,
    };

    expect(actual[0]).toEqual(expected);
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
    });
    unsubscribes.push(unsubscribe1);

    const unsubscribe2 = await subscribe({
      name: 'other_event_handler',
      eventType,
      eventHandler: eventHandler2,
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
    Étant donnée un subscriber déjà enregistré
    Lorsqu'on clean le registre des subscribers
    Alors le subscriber n'est plus enregistré
  `, async () => {
    // Arrange
    const unsubscribe = await subscribe({
      name: 'event_handler',
      eventType,
      eventHandler: () => Promise.resolve(),
    });
    unsubscribes.push(unsubscribe);

    // Act
    await deleteAllSubscribers();

    const subscribers = await executeSelect(
      `
          select *
          from event_store.subscriber
          where subscriber_id = $1`,
      'event_handler',
    );

    expect(subscribers.length).toBe(0);
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
    await deleteAllSubscribers();
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

    await deleteAllSubscribers();

    const unsubscribe = await subscribe({
      name: 'event_handler',
      eventType,
      eventHandler,
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
