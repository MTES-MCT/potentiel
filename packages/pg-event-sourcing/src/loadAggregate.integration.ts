import { none, AggregateFactory } from '@potentiel/core-domain';
import { executeQuery } from './helpers/executeQuery';
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
    const result = await loadAggregate(aggregateId);

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
      2,
      { secondePropriété: 'seconde-propriété' },
    );

    // Act
    const aggregateFactory: AggregateFactory = (aggregateId, events) =>
      events.reduce(
        (aggregate, event, index) => {
          return { ...aggregate, version: index + 1 };
        },
        { aggregateId, version: 0 },
      );

    const actual = await loadAggregate(aggregateId, aggregateFactory);

    // Assert
    expect(actual).toEqual({
      aggregateId,
      version: 2,
    });
  });
});
