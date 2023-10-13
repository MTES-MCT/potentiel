import { beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { executeQuery } from '@potentiel/pg-helpers';
import { publish } from './publish';
import { loadFromStream } from '../load/loadFromStream';
import { DomainEvent } from '@potentiel-domain/core';

describe(`publish`, () => {
  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  beforeEach(() => executeQuery(`delete from event_store.event_stream`));

  it(`Lorsqu'on publie un événement,
    alors l'événement devrait être présent dans le stream`, async () => {
    const streamId = 'string|string';

    const event: DomainEvent = {
      type: 'Un-événement-métier-est-survenu',
      payload: { test: 'propriété-test' },
    };
    await publish(streamId, event);

    const actual = await loadFromStream({ streamId });

    const expected = [expect.objectContaining(event)];

    expect(actual).toEqual(expected);
  });

  it(`Lorsqu'on publie plusieurs événements,
    alors les événements devrait être présent dans le stream dans l'ordre de publication`, async () => {
    const streamId = 'string|string';

    const event1: DomainEvent = {
      type: 'Un-événement-métier-est-survenu',
      payload: { test: 'propriété-test' },
    };

    const event2: DomainEvent = {
      type: 'Un-autre-événement-métier-est-survenu',
      payload: { test2: 'autre-propriété-test' },
    };

    await publish(streamId, event1, event2);

    const actual = await loadFromStream({ streamId });

    const expected = [expect.objectContaining(event1), expect.objectContaining(event2)];

    expect(actual).toEqual(expected);
  });
});
