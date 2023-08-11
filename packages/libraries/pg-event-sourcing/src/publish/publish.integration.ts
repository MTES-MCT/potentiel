import { describe, expect, it } from '@jest/globals';
import { executeSelect, executeQuery } from '@potentiel/pg-helpers';
import { publish } from './publish';

describe(`publish`, () => {
  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  beforeEach(() => executeQuery(`delete from event_store.event_stream`));

  it(`Lorsqu'on publie un événement,
    alors l'événement devrait être présent dans le stream`, async () => {
    const stream_id = 'string|string';

    const event = {
      type: 'Un-événement-métier-est-survenu',
      payload: { test: 'propriété-test' },
    };
    await publish(stream_id, event);

    const actuals = await executeSelect(
      `select * from event_store.event_stream where stream_id = $1`,
      stream_id,
    );

    expect(actuals).toHaveLength(1);
    expect(actuals[0]).toEqual({
      ...event,
      stream_id,
      version: 1,
      created_at: expect.any(String),
    });
  });

  it(`Lorsqu'on publie plusieurs événements,
    alors les événements devrait être présent dans le stream dans l'ordre de publication`, async () => {
    const stream_id = 'string|string';

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

    await publish(stream_id, ...events);

    const actuals = await executeSelect(
      `select * from event_store.event_stream where stream_id = $1`,
      stream_id,
    );

    expect(actuals).toEqual(
      events.map((event, index) => ({
        ...event,
        stream_id,
        version: index + 1,
        created_at: expect.any(String),
      })),
    );
  });
});
