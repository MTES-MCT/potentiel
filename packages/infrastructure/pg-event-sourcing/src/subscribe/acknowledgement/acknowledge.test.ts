import { describe, it, after, before, beforeEach } from 'node:test';

import { expect, should } from 'chai';

import { DomainEvent } from '@potentiel-domain/core';
import { executeQuery, killPool } from '@potentiel-libraries/pg-helpers';

import { publish } from '../../publish/publish.js';
import { registerSubscriber } from '../subscriber/registerSubscriber.js';

import { acknowledge, acknowledgeError } from './acknowledge.js';
import { getPendingAcknowledgements } from './getPendingAcknowledgements.js';

should();

describe('acknowledgement', () => {
  const streamCategory = 'category';
  const id = 'id';
  const subscriberName = 'subscriber';

  after(async () => {
    await killPool();
  });

  beforeEach(async () => {
    await executeQuery('delete from event_store.event_stream');
    await executeQuery('delete from event_store.subscriber');
    await executeQuery('delete from event_store.pending_acknowledgement');
  });

  before(async () => {
    process.env.DATABASE_CONNECTION_STRING = 'postgres://potentiel@localhost:5433/potentiel';

    await executeQuery(
      'DROP RULE IF EXISTS prevent_delete_on_event_stream on event_store.event_stream',
    );
  });

  it(`
    Étant donnée un acknowledgement en attente correspondant à un événement
    Quand un event est acknowledge
    Alors l'acknowledgement n'est plus en attente
  `, async () => {
    // Arrange
    const event1: DomainEvent = {
      type: 'event-1',
      payload: { test1: '1' },
    };

    await registerSubscriber({
      eventType: 'event-1',
      name: subscriberName,
      streamCategory,
    });

    await publish(`${streamCategory}|${id}`, event1);

    const acknowledgements = await getPendingAcknowledgements(streamCategory, subscriberName);

    // Act
    await acknowledge(acknowledgements[0]);
    const actuals = await getPendingAcknowledgements(streamCategory, subscriberName);

    // Assert
    actuals.length.should.be.equal(0);
  });

  it(`
    Étant donnée un acknowledgement en attente correspondant à un événement
    Quand un event est acknowledge en erreur
    Alors l'acknowledgement est en erreur
  `, async () => {
    // Arrange
    const event1: DomainEvent = {
      type: 'event-1',
      payload: { test1: '1' },
    };

    const error = new Error('An error');

    await registerSubscriber({
      eventType: 'event-1',
      name: subscriberName,
      streamCategory,
    });

    await publish(`${streamCategory}|${id}`, event1);

    const acknowledgements = await getPendingAcknowledgements(streamCategory, subscriberName);

    // Act
    await acknowledgeError(acknowledgements[0], error);
    const actuals = await getPendingAcknowledgements(streamCategory, subscriberName);

    // Assert
    actuals.length.should.be.equal(1);

    const expected = 'An error';

    expect(actuals[0].error).to.be.equal(expected);
  });
});
