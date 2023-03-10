import { publishFactory } from './publish';

describe(`publish`, () => {
  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });
  it(`Lorsqu'on publie un événement,
    alors l'événement devrait être présent dans le stream`, async () => {
    const publish = publishFactory();

    const streamId = 'string#string';

    const event = {
      createdAt: new Date().toISOString(),
      type: 'Un-événement-métier-est-survenu',
      payload: { test: 'propriété-test' },
    };
    await publish(streamId, event);

    const loadFromStreamFactory = jest.fn(() => jest.fn());

    const loadFromStream = loadFromStreamFactory();

    const actuals = await loadFromStream(streamId);

    expect(actuals).toHaveLength(1);
    expect(actuals[0]).toEqual(event);
  });
});
