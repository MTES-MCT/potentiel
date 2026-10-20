import assert from 'node:assert/strict';
import { beforeEach, describe, test } from 'node:test';

import { withCache } from './withCache.js';

describe('withCache', () => {
  let now = 0;
  let calls = 0;
  let shouldFail = false;

  const fetch = async () => {
    calls++;
    if (shouldFail) {
      throw new Error('unavailable');
    }
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

    // first call, retourne 1 call, set nows = 999 (not obsolete)
    await cachedFetch();
    now = 999;

    // second call, expect 1 (fetch not recalled because cache has been triggered)
    await cachedFetch();
    assert.equal(calls, 1);
  });

  test('rafraîchit la valeur une fois la durée de cache expirée', async () => {
    const cachedFetch = createCache();

    // first call and set now to expired value (cf cacheTimeInMs)
    await cachedFetch();
    now = 1000;

    // second call expect a new fetch call
    await cachedFetch();
    assert.equal(calls, 2);
  });

  test('mutualise les appels simultanés', async () => {
    const cachedFetch = createCache();

    // concurrent call expect only one call
    await Promise.all([cachedFetch(), cachedFetch()]);
    assert.equal(calls, 1);
  });

  test('renvoie la valeur expirée si le rafraîchissement échoue', async () => {
    const cachedFetch = createCache();

    // set first call and set now to expired value
    await cachedFetch();
    now = 1000;

    // set erreur mode to true and second call expect calls to be eq 1
    shouldFail = true;
    await cachedFetch();

    assert.equal(calls, 1);
  });

  test('propage l’erreur si aucune valeur n’est en cache', async () => {
    const cachedFetch = createCache();

    // first call w/ erreur
    shouldFail = true;
    await assert.rejects(cachedFetch(), /unavailable/);

    // second call without error mode
    shouldFail = false;
    await cachedFetch();

    assert.equal(calls, 2);
  });
});
