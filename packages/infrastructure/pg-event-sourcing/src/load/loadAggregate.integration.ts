import { beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { DomainEvent, AggregateFactory, Aggregate } from '@potentiel-domain/core';
import { none } from '@potentiel/monads';
import { executeQuery } from '@potentiel/pg-helpers';
import { loadAggregate } from './loadAggregate';
import { publish } from '../publish/publish';

describe(`loadAggregate`, () => {
  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  beforeEach(() => executeQuery(`delete from event_store.event_stream`));

  it(`Lorsqu'on charge un agrégat sans évènement
      Alors aucun agrégat ne devrait être chargé`, async () => {
    // Arrange
    const aggregateId = 'aggregateCategory|aggregateId';

    // Act
    const result = await loadAggregate(aggregateId, () => ({}));

    // Assert
    expect(result).toBe(none);
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

    const aggregateStateFactory: AggregateFactory<AggregateState, Event1 | Event2> = (events) =>
      events.reduce((state, event) => {
        switch (event.type) {
          case 'event-1':
            return { ...state, propriété: event.payload.propriété };

          case 'event-2':
            return { ...state, secondePropriété: event.payload.secondePropriété };

          default:
            return { ...state };
        }
      }, {});

    // Act
    const actual = await loadAggregate(aggregateId, aggregateStateFactory);

    // Assert
    const expected: Aggregate & AggregateState = {
      aggregateId,
      version: 2,
      propriété: 'première-propriété',
      secondePropriété: 'seconde-propriété',
    };

    expect(actual).toEqual(expected);
  });
});
