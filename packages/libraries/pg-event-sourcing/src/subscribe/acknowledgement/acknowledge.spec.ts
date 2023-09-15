import { describe, it, expect, afterAll, beforeEach, beforeAll } from '@jest/globals';
import { DomainEvent } from '@potentiel/core-domain';
import { publish } from '../../publish/publish';
import { acknowledge } from './acknowledge';
import { registerSubscriber } from '../subscriber/registerSubscriber';
import { executeQuery, killPool } from '@potentiel/pg-helpers';
import { getPendingAcknowledgements } from './getPendingAcknowledgements';

describe('acknowledgement', () => {
  afterAll(async () => {
    await killPool();
  });

  beforeEach(async () => {
    await executeQuery(`delete from event_store.event_stream`);
    await executeQuery(`delete from event_store.subscriber`);
    await executeQuery(`delete from event_store.pending_acknowledgement`);
  });

  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  it(`
    Étant donnée un acknowledgement en attente correspondant à un événement
    Quand un event est acknowledge
    Alors l'acknowledgement n'est plus en attente
  `, async () => {
    // Arrange
    const subscriberName = 'subscriber';
    const streamCategory = 'category';
    const id = 'id';

    const event1: DomainEvent = {
      type: 'event-1',
      payload: { test1: '1' },
    };

    await registerSubscriber({
      eventType: 'event-1',
      name: 'subscriber',
      streamCategory,
    });

    await publish(`${streamCategory}|${id}`, event1);

    const acknowledgements = await getPendingAcknowledgements(streamCategory, subscriberName);

    // Act
    await acknowledge(acknowledgements[0]);
    const actuals = await getPendingAcknowledgements(streamCategory, subscriberName);

    // Assert
    expect(actuals.length).toBe(0);
  });
});
