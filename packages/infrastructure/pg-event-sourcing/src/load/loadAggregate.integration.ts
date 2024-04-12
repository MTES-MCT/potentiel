import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { DomainEvent, Aggregate, GetDefaultAggregateState } from '@potentiel-domain/core';
import { executeQuery } from '@potentiel-librairies/pg-helpers';
import { loadAggregate } from './loadAggregate';
import { publish } from '../publish/publish';

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
  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  beforeEach(() => executeQuery(`delete from event_store.event_stream`));

  it(`Lorsqu'on charge un agrégat sans évènement
      Alors l'agrégat par défaut devrais être chargé`, async () => {
    // Arrange
    const aggregateId = 'aggregateCategory|aggregateId';

    // Act
    const result = await loadAggregate({
      aggregateId,
      getDefaultAggregate,
    });

    // Assert
    expect(result.propriété).toBe('unknownPropriété');
    expect(result.secondePropriété).toBe('unknownSecondePropriété');
  });

  it(`Lorsqu'on charge un agrégat sans évènement mais avec une fonction de callback onNone
      Alors la fonction de callback doit être appelé`, async () => {
    // Arrange
    const aggregateId = 'aggregateCategory|aggregateId';

    const onNone = jest.fn();

    // Act
    const result = await loadAggregate({
      aggregateId,
      getDefaultAggregate,
      onNone,
    });

    // Assert
    expect(onNone).toBeCalledTimes(1);
  });

  it(`Lorsqu'on charge un agrégat avec des évènements
      Alors l'agrégat devrait être chargé`, async () => {
    // Arrange
    const aggregateId = 'aggregateCategory|aggregateId';

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

    type AggregateState = {
      propriété?: string;
      secondePropriété?: string;
    };

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

    expect(actual).toEqual(expect.objectContaining(expected));
  });
});
