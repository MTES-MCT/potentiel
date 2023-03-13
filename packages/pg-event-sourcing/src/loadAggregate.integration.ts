import { executeQuery } from './helpers/executeQuery';
import { loadAggregate } from './loadAggregate';

describe(`loadAggregate`, () => {
  const aggregateId = 'aggregateCategory#aggregateId';

  beforeEach(() => executeQuery(`DELETE FROM "EVENT_STREAM" WHERE "streamId" = $1`, aggregateId));

  it(`Lorsqu'on charge un agrégat sans évènement
      Alors aucun agrégat ne devrait être chargé`, async () => {
    // Arrange

    // Act
    const actual = await loadAggregate(aggregateId);

    // Assert
    expect(actual).toBeUndefined();
  });
});
