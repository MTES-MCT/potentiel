import { describe, it, after, before, beforeEach } from 'node:test';
import { randomBytes } from 'node:crypto';

import { should } from 'chai';

import { DomainEvent, AbstractAggregate } from '@potentiel-domain/core';
import { executeQuery, killPool } from '@potentiel-libraries/pg-helpers';

import { publish } from '../publish/publish.js';

import { loadAggregate } from './loadAggregate.js';

should();

type CustomEvent1 = DomainEvent<'event-1', { propriété: string }>;
type CustomEvent2 = DomainEvent<'event-2', { secondePropriété: string }>;

type CustomEvent = CustomEvent1 | CustomEvent2;

class CustomAggregate extends AbstractAggregate<CustomEvent, 'aggregateCategory'> {
  propriété: string = 'unknownPropriété';
  secondePropriété: string = 'unknownSecondePropriété';

  apply(event: CustomEvent) {
    switch (event.type) {
      case 'event-1':
        this.propriété = event.payload.propriété;
        break;
      case 'event-2':
        this.secondePropriété = event.payload.secondePropriété;
    }
  }
}

describe(`loadAggregate`, () => {
  const aggregateId = `aggregateCategory|${randomBytes(10).toString('hex')}` as const;
  before(async () => {
    process.env.DATABASE_CONNECTION_STRING = 'postgres://potentiel@localhost:5433/potentiel';

    await executeQuery(
      'DROP RULE IF EXISTS prevent_delete_on_event_stream on event_store.event_stream',
    );
  });

  beforeEach(async () => {
    await executeQuery(`delete from event_store.event_stream where stream_id = $1`, aggregateId);
  });

  after(async () => {
    await killPool();
  });

  it(`Lorsqu'on charge un agrégat sans évènement
      Alors l'agrégat par défaut devrais être chargé`, async () => {
    // Act
    const result = await loadAggregate(CustomAggregate, aggregateId, undefined);

    // Assert
    result.propriété.should.be.equal('unknownPropriété');
    result.secondePropriété.should.be.equal('unknownSecondePropriété');
  });

  it(`Lorsqu'on charge un agrégat avec des évènements
      Alors l'agrégat devrait être chargé`, async () => {
    type Event1 = DomainEvent<'event-1', { propriété: string }>;
    type Event2 = DomainEvent<'event-2', { secondePropriété: string }>;

    const event1: Event1 = {
      type: 'event-1',
      payload: {
        propriété: 'première-propriété',
      },
    };

    const event2: Event2 = {
      type: 'event-2',
      payload: {
        secondePropriété: 'seconde-propriété',
      },
    };

    await publish(aggregateId, event1, event2);

    // Act
    const actual = await loadAggregate(CustomAggregate, aggregateId, undefined);

    // Assert
    const expected = {
      aggregateId,
      version: 2,
      propriété: 'première-propriété',
      secondePropriété: 'seconde-propriété',
    };

    actual.exists.should.be.true;
    actual.propriété.should.be.deep.equal(expected.propriété);
    actual.secondePropriété.should.be.deep.equal(expected.secondePropriété);
  });
});
