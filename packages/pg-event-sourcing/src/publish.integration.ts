import { executeQuery } from './helpers/executeQuery';
import { loadFromStream } from './loadFromStream';
import { publish } from './publish';

describe(`publish`, () => {
  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  beforeEach(() => executeQuery(`DELETE FROM "EVENT_STREAM"`));

  it(`Lorsqu'on publie un événement,
    alors l'événement devrait être présent dans le stream`, async () => {
    const streamId = 'string#string';

    const event = {
      type: 'Un-événement-métier-est-survenu',
      payload: { test: 'propriété-test' },
    };
    await publish(streamId, event);

    const actuals = await loadFromStream(streamId);

    expect(actuals).toHaveLength(1);
    expect(actuals[0]).toEqual(event);
  });
});
