import { beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { loadFromStream } from './loadFromStream';
import { RebuildTriggered } from '@potentiel/core-domain-views';
import { executeQuery } from '@potentiel/pg-helpers';
import { publish } from '../publish/publish';
import { DomainEvent } from '@potentiel/core-domain';

describe(`loadFromStream`, () => {
  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  beforeEach(() => executeQuery(`delete from event_store.event_stream`));

  it(`Étant donné des événements dans un stream,
      Lorsqu'on charge un stream
      Alors les événements devraient être récupérés dans l'ordre de création et de versionning
      Mais les évènements de type RebuildTriggered ne sont pas récupérés`, async () => {
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

    const event3: RebuildTriggered = {
      type: 'RebuildTriggered',
      payload: { category: 'string', id: 'string' },
    };

    await publish('string|string', event1, event2, event3);

    // Act
    const actuals = await loadFromStream({ streamId });

    // Assert
    expect(actuals).toEqual([expect.objectContaining(event1), expect.objectContaining(event2)]);
  });

  it(`Étant donné des événements dans un stream,
      Lorsqu'on charge un stream avec des types d'événement spécifique
      Alors les événements devraient être récupérés dans l'ordre de création et de versionning
      Mais les évènements de type RebuildTriggered ne sont pas récupérés`, async () => {
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

    const event4: RebuildTriggered = {
      type: 'RebuildTriggered',
      payload: { category: 'string', id: 'string' },
    };

    await publish(streamId, event1, event2, event3, event4);

    // Act
    const actual = await loadFromStream({ streamId, eventTypes: ['event-1'] });

    // Assert
    const expected = [expect.objectContaining(event1), expect.objectContaining(event3)];
    expect(actual).toEqual(expected);
  });

  it(`Étant donné des événements dans un stream,
      Lorsqu'on charge un stream avec le type d'événement RebuildTriggered
      Alors aucun événement n'est récupéré`, async () => {
    // Arrange
    const streamId = 'string|string';

    const event1: DomainEvent = {
      type: 'event-1',
      payload: { test1: '1' },
    };

    const event2: RebuildTriggered = {
      type: 'RebuildTriggered',
      payload: { category: 'string', id: 'string' },
    };

    await publish(streamId, event1, event2);

    // Act
    const actuals = await loadFromStream({ streamId, eventTypes: ['RebuildTriggered'] });

    // Assert
    const expected: Array<DomainEvent> = [];
    expect(actuals).toEqual(expected);
  });
});
