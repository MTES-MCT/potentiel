import { describe, it, after, before, beforeEach } from 'node:test';

import { should } from 'chai';
import { v4 } from 'uuid';

import { DomainEvent, Aggregate, GetDefaultAggregateState } from '@potentiel-domain/core';
import { executeQuery, killPool } from '@potentiel-libraries/pg-helpers';

import { publish } from '../publish/publish';

import { loadAggregate } from './loadAggregate';

should();

type CustomEvent1 = DomainEvent<'event-1', { propriété: string }>;
type CustomEvent2 = DomainEvent<'event-2', { secondePropriété: string }>;

type CustomEvent = CustomEvent1 | CustomEvent2;

type CustomAggregate = Aggregate<CustomEvent> & {
  propriété: string;
  secondePropriété: string;
};

function apply(this: CustomAggregate, event: CustomEvent) {
  switch (event.type) {
    case 'event-1':
      this.propriété = event.payload.propriété;
      break;
    case 'event-2':
      this.secondePropriété = event.payload.secondePropriété;
  }
}

const getDefaultAggregate: GetDefaultAggregateState<CustomAggregate, CustomEvent> = () => {
  return {
    propriété: 'unknownPropriété',
    secondePropriété: 'unknownSecondePropriété',
    apply,
  };
};

describe(`loadAggregate`, () => {
  const aggregateId = `aggregateCategory|${v4()}` as const;
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
    const result = await loadAggregate({
      aggregateId,
      getDefaultAggregate,
    });

    // Assert
    result.propriété.should.be.equal('unknownPropriété');
    result.secondePropriété.should.be.equal('unknownSecondePropriété');
  });

  it(`Lorsqu'on charge un agrégat sans évènement mais avec une fonction de callback onNone
      Alors la fonction de callback doit être appelé`, async () => {
    let onNoneCalled = false;

    const onNone = () => {
      onNoneCalled = true;
    };

    // Act
    await loadAggregate({
      aggregateId,
      getDefaultAggregate,
      onNone,
    });

    // Assert
    onNoneCalled.should.be.true;
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
    const actual = await loadAggregate({
      aggregateId,
      getDefaultAggregate,
    });

    // Assert
    const expected = {
      aggregateId,
      version: 2,
      propriété: 'première-propriété',
      secondePropriété: 'seconde-propriété',
    };

    actual.aggregateId.should.be.deep.equal(expected.aggregateId);
    actual.propriété.should.be.deep.equal(expected.propriété);
    actual.secondePropriété.should.be.deep.equal(expected.secondePropriété);
    actual.version.should.be.deep.equal(expected.version);
  });
});
