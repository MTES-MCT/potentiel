import { describe, it, expect, afterAll, beforeEach, beforeAll } from '@jest/globals';
import { executeQuery, killPool } from '@potentiel/pg-helpers';
import { registerSubscriber } from './registerSubscription';
import { getSubscriber } from './getSubscriber';
import { SubscriberConfiguration } from './subscriberConfiguration';

describe('register-subscription', () => {
  afterAll(async () => {
    await killPool();
  });

  beforeEach(async () => {
    await executeQuery(`delete from event_store.subscriber`);
  });

  beforeAll(() => {
    process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  });

  it(`
    Étant donnée une subscriber
    Quand le subscriber est ajouté au registre pour un type d'event données
    Alors la configuration du subscriber est disponible dans le registre
  `, async () => {
    // Arrange
    const name = 'subscriber';
    const streamCategory = 'category';

    const subscriberConfiguration: SubscriberConfiguration = {
      eventType: 'event-1',
      name,
      streamCategory,
    };

    // Act
    await registerSubscriber(subscriberConfiguration);

    const actual = await getSubscriber(streamCategory, name);

    // Assert
    const expected: SubscriberConfiguration = {
      eventType: 'event-1',
      name,
      streamCategory,
    };
    expect(actual).toEqual(expected);
  });
});
