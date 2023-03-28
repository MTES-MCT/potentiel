import { DomainEvent, AggregateStateFactory } from '@potentiel/core-domain';
import { none } from '@potentiel/monads';
import { executeQuery } from '@potentiel/pg-helpers';
import { loadAggregate } from './loadAggregate';

describe(`loadAggregate`, () => {
  const aggregateId = 'aggregateCategory#aggregateId';

  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  beforeEach(() => executeQuery(`DELETE FROM "EVENT_STREAM" WHERE "streamId" = $1`, aggregateId));

  it(`Lorsqu'on charge un agrégat sans évènement
      Alors aucun agrégat ne devrait être chargé`, async () => {
    // Arrange

    // Act
    const result = await loadAggregate(aggregateId, () => ({}));

    // Assert
    expect(result).toBe(none);
  });

  it(`Lorsqu'on charge un agrégat avec des évènements
      Alors l'agrégat devrait être chargé`, async () => {
    // Arrange
    const createdAt = new Date().toISOString();

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
      aggregateId,
      createdAt,
      'event-1',
      1,
      { propriété: 'première-propriété' },
    );

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
      aggregateId,
      createdAt,
      'event-2',
      15,
      { secondePropriété: 'seconde-propriété' },
    );

    // Act
    type FakeAggregateState = {
      propriété?: string;
      secondePropriété?: string;
    };

    type Event1 = DomainEvent<'event-1', { propriété: string }>;
    type Event2 = DomainEvent<'event-2', { secondePropriété: string }>;
    type FakeAggregateEvent = Event1 | Event2;

    const aggregateStateFactory: AggregateStateFactory<FakeAggregateState, FakeAggregateEvent> = (
      events,
    ) =>
      events.reduce((state, event) => {
        switch (event.type) {
          case 'event-1':
            return { ...state, proriété: event.payload.propriété };

          case 'event-2':
            return { ...state, secondePropriété: event.payload.secondePropriété };

          default:
            return { ...state };
        }
      }, {});

    const actual = await loadAggregate(aggregateId, aggregateStateFactory);

    // Assert
    expect(actual).toEqual({
      aggregateId,
      version: 15,
      proriété: 'première-propriété',
      secondePropriété: 'seconde-propriété',
    });
  });
});
