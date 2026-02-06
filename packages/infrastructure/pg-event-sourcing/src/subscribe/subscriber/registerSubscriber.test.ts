import { describe, it, after, before, beforeEach } from 'node:test';

import { assert, expect, should } from 'chai';

import { executeQuery, killPool } from '@potentiel-libraries/pg-helpers';

import { registerSubscriber } from './registerSubscriber.js';
import { getSubscriber } from './getSubscriber.js';
import { SubscriberConfiguration } from './subscriberConfiguration.js';
import { WrongSubscriberNameError } from './checkSubscriberName.js';

should();

describe('register-subscription', () => {
  const streamCategory = 'category';
  const subscriberName = 'subscriber';

  after(async () => {
    await killPool();
  });

  beforeEach(async () => {
    await executeQuery('delete from event_store.subscriber');
  });

  before(async () => {
    process.env.DATABASE_CONNECTION_STRING = 'postgres://potentiel@localhost:5433/potentiel';

    await executeQuery(
      'DROP RULE IF EXISTS prevent_delete_on_event_stream on event_store.event_stream',
    );
  });

  it(`
    Étant donné un subscriber
    Quand le subscriber est ajouté au registre pour un type d'event donné
    Alors la configuration du subscriber est disponible dans le registre
  `, async () => {
    // Arrange
    const subscriberConfiguration: SubscriberConfiguration = {
      eventType: 'event-1',
      name: subscriberName,
      streamCategory,
    };

    // Act
    await registerSubscriber(subscriberConfiguration);

    const actual = await getSubscriber(streamCategory, subscriberName);

    // Assert
    const expected: SubscriberConfiguration = {
      eventType: 'event-1',
      name: subscriberName,
      streamCategory,
    };

    actual.should.be.deep.equal(expected);
  });

  it(`
    Étant donné un subscriber
    Quand le subscriber est ajouté au registre pour tous les types d'event
    Alors la configuration du subscriber est disponible dans le registre
  `, async () => {
    // Arrange
    const subscriberConfiguration: SubscriberConfiguration = {
      eventType: 'all',
      name: subscriberName,
      streamCategory,
    };

    // Act
    await registerSubscriber(subscriberConfiguration);

    const actual = await getSubscriber(streamCategory, subscriberName);

    // Assert
    const expected: SubscriberConfiguration = {
      eventType: 'all',
      name: subscriberName,
      streamCategory,
    };
    actual.should.be.deep.equal(expected);
  });

  it(`
    Étant donné un subscriber
    Quand le subscriber est ajouté au registre pour plusieurs types d'event
    Alors la configuration du subscriber est disponible dans le registre
  `, async () => {
    // Arrange
    const subscriberConfiguration: SubscriberConfiguration = {
      eventType: ['event-1', 'event-2'],
      name: subscriberName,
      streamCategory,
    };

    // Act
    await registerSubscriber(subscriberConfiguration);

    const actual = await getSubscriber(streamCategory, subscriberName);

    // Assert
    const expected: SubscriberConfiguration = {
      eventType: ['event-1', 'event-2'],
      name: subscriberName,
      streamCategory,
    };
    actual.should.be.deep.equal(expected);
  });

  it(`
    Étant donné un subscriber
    Quand le subscriber est ajouté au registre
    Mais que le nom du subscriber n'utilise pas la convention de nommage kebab-case
    Alors une erreur est levée
  `, async () => {
    const subscriberConfiguration: SubscriberConfiguration = {
      eventType: 'event-1',
      name: 'eventHandler',
      streamCategory: 'category',
    };

    try {
      await registerSubscriber(subscriberConfiguration);
      assert.fail('should throw');
    } catch (e) {
      expect(e).to.be.instanceOf(WrongSubscriberNameError);
    }
  });
});
