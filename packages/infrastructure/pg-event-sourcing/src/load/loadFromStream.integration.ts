import { beforeAll, beforeEach, describe, expect, it } from '@jest/globals';

import { executeQuery } from '@potentiel-libraries/pg-helpers';
import { DomainEvent } from '@potentiel-domain/core';

import { publish } from '../publish/publish';

import { loadFromStream } from './loadFromStream';

describe(`loadFromStream`, () => {
  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  beforeEach(() => executeQuery(`delete from event_store.event_stream`));

  it(`Étant donné des événements dans un stream,
      Lorsqu'on charge un stream
      Alors les événements devraient être récupérés dans l'ordre de création et de versionning`, async () => {
    // Arrange
    const streamId = 'string|string';

    const event1: DomainEvent = {
      type: 'event-1',
      payload: { test1: '1' },
    };

    const event2: DomainEvent = {
      type: 'event-2',
      payload: { test2: '2' },
    };

    await publish('string|string', event1, event2);

    // Act
    const actuals = await loadFromStream({ streamId });

    // Assert
    expect(actuals).toEqual([expect.objectContaining(event1), expect.objectContaining(event2)]);
  });

  it(`Étant donné des événements dans un stream,
      Lorsqu'on charge un stream avec des types d'événement spécifique
      Alors les événements devraient être récupérés dans l'ordre de création et de versionning`, async () => {
    // Arrange
    const streamId = 'string|string';

    const event1: DomainEvent = {
      type: 'event-1',
      payload: { test1: '1' },
    };

    const event2: DomainEvent = {
      type: 'event-2',
      payload: { test2: '2' },
    };

    const event3: DomainEvent = {
      type: 'event-1',
      payload: { test1: '3' },
    };

    await publish(streamId, event1, event2, event3);

    // Act
    const actual = await loadFromStream({ streamId, eventTypes: ['event-1'] });

    // Assert
    const expected = [expect.objectContaining(event1), expect.objectContaining(event3)];
    expect(actual).toEqual(expected);
  });
});
