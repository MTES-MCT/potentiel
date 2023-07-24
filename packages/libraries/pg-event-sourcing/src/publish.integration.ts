import { executeSelect, executeQuery } from '@potentiel/pg-helpers';
import { publish } from './publish';

describe(`publish`, () => {
  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  beforeEach(() => executeQuery(`delete from event_store.event_stream`));

  it(`Lorsqu'on publie un événement,
    alors l'événement devrait être présent dans le stream`, async () => {
    const streamId = 'string#string';

    const event = {
      type: 'Un-événement-métier-est-survenu',
      payload: { test: 'propriété-test' },
    };
    await publish(streamId, event);

    const actuals = await executeSelect(
      `select * from event_store.event_stream where stream_id = $1`,
      streamId,
    );

    expect(actuals).toHaveLength(1);
    expect(actuals[0]).toEqual({
      ...event,
      streamId,
      version: 1,
      createdAt: expect.any(String),
    });
  });

  it(`Lorsqu'on publie plusieurs événements,
    alors les événements devrait être présent dans le stream dans l'ordre de publication`, async () => {
    const streamId = 'string#string';

    const events = [
      {
        type: 'Un-événement-métier-est-survenu',
        payload: { test: 'propriété-test' },
      },
      {
        type: 'Un-autre-événement-métier-est-survenu',
        payload: { test2: 'autre-propriété-test' },
      },
    ];

    await publish(streamId, ...events);

    const actuals = await executeSelect(
      `seelct * from event_store.event_stream where stream_id = $1`,
      streamId,
    );

    expect(actuals).toEqual(
      events.map((event, index) => ({
        ...event,
        streamId,
        version: index + 1,
        createdAt: expect.any(String),
      })),
    );
  });
});
