import { describe, it, after, before, beforeEach } from 'node:test';

import { should } from 'chai';
import { v4 } from 'uuid';

import { executeQuery, killPool } from '@potentiel-libraries/pg-helpers';
import { DomainEvent } from '@potentiel-domain/core';

import { publish } from '../publish/publish';

import { loadFromStream } from './loadFromStream';

should();

describe(`loadFromStream`, () => {
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

  it(`Étant donné des événements dans un stream,
      Lorsqu'on charge un stream
      Alors les événements devraient être récupérés dans l'ordre de création et de versionning`, async () => {
    // Arrange
    const event1: DomainEvent = {
      type: 'event-1',
      payload: { test1: '1' },
    };

    const event2: DomainEvent = {
      type: 'event-2',
      payload: { test2: '2' },
    };

    await publish(streamId, event1, event2);

    // Act
    const actual = await loadFromStream({ streamId });
    actual.length.should.be.equal(2);
    const [actual1, actual2] = actual;

    // Assert
    actual1.type.should.be.equal(event1.type);
    actual2.type.should.be.equal(event2.type);
    actual1.payload.should.be.deep.equal(event1.payload);
    actual2.payload.should.be.deep.equal(event2.payload);
  });

  it(`Étant donné des événements dans un stream,
      Lorsqu'on charge un stream avec des types d'événement spécifique
      Alors les événements devraient être récupérés dans l'ordre de création et de versionning`, async () => {
    // Arrange
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
    actual.length.should.be.equal(2);
    const [actual1, actual2] = actual;

    // Assert
    actual1.type.should.be.equal(event1.type);
    actual2.type.should.be.equal(event3.type);
    actual1.payload.should.be.deep.equal(event1.payload);
    actual2.payload.should.be.deep.equal(event3.payload);
  });
});
