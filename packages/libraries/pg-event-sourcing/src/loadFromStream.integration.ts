import { executeQuery } from '@potentiel/pg-helpers';
import { loadFromStream } from './loadFromStream';

describe(`loadFromStream`, () => {
  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  beforeEach(() => executeQuery(`delete from event_store.event_stream`));

  it(`Étant donné des événements dans un stream,
      Lorsqu'on charge un stream
      Alors les événements devrait être récupérer dans l'ordre createdAt + version`, async () => {
    const streamId = 'string#string';
    const createdAt = new Date().toISOString();

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
      'event-2',
      2,
      { test2: '2' },
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
      'event-1',
      1,
      { test1: '1' },
    );

    const actuals = await loadFromStream(streamId);

    expect(actuals).toEqual([
      {
        type: 'event-1',
        version: 1,
        payload: { test1: '1' },
      },
      {
        type: 'event-2',
        version: 2,
        payload: { test2: '2' },
      },
    ]);
  });
});
