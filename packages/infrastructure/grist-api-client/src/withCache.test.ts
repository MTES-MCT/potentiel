import assert from 'node:assert/strict';
import { beforeEach, describe, test } from 'node:test';

import { withCache } from './withCache.js';

describe('withCache', () => {
  let now = 0;
  let calls = 0;
  let shouldFail = false;

  const fetch = async () => {
    if (shouldFail) {
      throw new Error('unavailable');
    }
    calls++;

    return calls;
  };

  beforeEach(() => {
    now = 0;
    calls = 0;
    shouldFail = false;
  });

  const createCache = () => withCache(fetch, { cacheTimeInMs: 1000, now: () => now });

  test('renvoie la valeur en cache tant que la durée de cache n’est pas expirée', async () => {
    const cachedFetch = createCache();

    // premier appel (calls = 1), puis now = 999 : le cache n'est pas encore expiré
    await cachedFetch();
    now = 999;

    // second appel : fetch n'est pas rappelé, la valeur vient du cache
    await cachedFetch();
    assert.equal(calls, 1);
  });

  test('rafraîchit la valeur une fois la durée de cache expirée', async () => {
    const cachedFetch = createCache();

    // premier appel, puis now passe à une valeur expirée (cf cacheTimeInMs)
    await cachedFetch();
    now = 1000;

    // second appel : fetch doit être rappelé
    await cachedFetch();
    assert.equal(calls, 2);
  });

  test('mutualise les appels simultanés', async () => {
    const cachedFetch = createCache();

    // appels simultanés : un seul appel à fetch attendu
    await Promise.all([cachedFetch(), cachedFetch()]);
    assert.equal(calls, 1);
  });

  test('renvoie la valeur expirée si le rafraîchissement échoue', async () => {
    const cachedFetch = createCache();

    // premier appel, puis now passe à une valeur expirée
    await cachedFetch();
    now = 1000;

    // le rafraîchissement échoue : la valeur expirée est renvoyée et calls reste à 1
    shouldFail = true;
    await cachedFetch();

    assert.equal(calls, 1);
  });

  test('propage l’erreur si aucune valeur n’est en cache', async () => {
    const cachedFetch = createCache();

    // premier appel en erreur
    shouldFail = true;
    await assert.rejects(cachedFetch(), /unavailable/);

    // second appel sans erreur
    shouldFail = false;
    await cachedFetch();

    assert.equal(calls, 1);
  });
});
