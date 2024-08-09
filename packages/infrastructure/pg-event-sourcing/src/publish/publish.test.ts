import { describe, it, after, before, beforeEach } from 'node:test';

import { should } from 'chai';
import { v4 } from 'uuid';

import { executeQuery, killPool } from '@potentiel-libraries/pg-helpers';
import { DomainEvent } from '@potentiel-domain/core';

import { loadFromStream } from '../load/loadFromStream';

import { publish } from './publish';

should();

describe(`publish`, () => {
  const streamId = `aggregateCategory|${v4()}` as const;

  before(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  beforeEach(async () => {
    await executeQuery(`delete from event_store.event_stream where stream_id = $1`, streamId);
  });

  after(async () => {
    await killPool();
  });

  it(`Lorsqu'on publie un événement,
    alors l'événement devrait être présent dans le stream`, async () => {
    const event = {
      type: 'Un-événement-métier-est-survenu',
      payload: { test: 'propriété-test' },
    };
    await publish(streamId, event);

    const actual = await loadFromStream({ streamId });
    actual.length.should.be.equal(1);
    const [actual1] = actual;

    actual1.type.should.be.equal(event.type);
    actual1.payload.should.be.deep.equal(event.payload);
  });

  it(`Lorsqu'on publie plusieurs événements,
    alors les événements devrait être présent dans le stream dans l'ordre de publication`, async () => {
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
    actual.length.should.be.equal(2);
    const [actual1, actual2] = actual;

    actual1.type.should.be.equal(event1.type);
    actual2.type.should.be.equal(event2.type);
    actual1.payload.should.be.deep.equal(event1.payload);
    actual2.payload.should.be.deep.equal(event2.payload);
  });
});
