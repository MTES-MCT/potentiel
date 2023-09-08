import { beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { loadFromStream } from './loadFromStream';
import { Event } from '../event';
import { insertEventsInDatabase } from '../fixtures/insertEventsInDatabase';
import { deleteAllEvents } from '../fixtures/deleteAllEvents';

describe(`loadFromStream`, () => {
  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  beforeEach(() => deleteAllEvents());

  it(`Étant donné des événements dans un stream,
      Lorsqu'on charge un stream
      Alors les événements devrait être récupérer dans l'ordre createdAt + version`, async () => {
    const streamId = 'string#string';

    const event1: Event = {
      stream_id: streamId,
      created_at: new Date().toISOString(),
      type: 'event-1',
      version: 1,
      payload: { test1: '1' },
    };

    const event2: Event = {
      stream_id: streamId,
      created_at: new Date().toISOString(),
      type: 'event-2',
      version: 2,
      payload: { test2: '2' },
    };

    await insertEventsInDatabase(event1, event2);

    const actuals = await loadFromStream({ streamId });

    expect(actuals).toEqual([event1, event2]);
  });

  it(`Étant donné des événements dans un stream,
      Lorsqu'on charge un stream avec des types d'événement spécifique
      Alors les événements devrait être récupérer dans l'ordre createdAt + version`, async () => {
    const streamId = 'string#string';

    const event1: Event = {
      stream_id: streamId,
      created_at: new Date().toISOString(),
      type: 'event-1',
      version: 1,
      payload: { test1: '1' },
    };

    const event2: Event = {
      stream_id: streamId,
      created_at: new Date().toISOString(),
      type: 'event-2',
      version: 2,
      payload: { test2: '2' },
    };

    const event3: Event = {
      stream_id: streamId,
      created_at: new Date().toISOString(),
      type: 'event-1',
      version: 3,
      payload: { test1: '3' },
    };

    await insertEventsInDatabase(event1, event2, event3);

    const actuals = await loadFromStream({ streamId, eventTypes: ['event-1'] });

    expect(actuals).toEqual([event1, event3]);
  });
});
