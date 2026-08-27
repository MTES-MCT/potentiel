import assert from 'node:assert';
import { describe, test } from 'node:test';

import { trierParJourPuisOrdreDInsertion } from './trierParJourPuisOrdreDInsertion';

type Item = { label: string; date: string };

const trierLabels = (items: ReadonlyArray<Item>) =>
  trierParJourPuisOrdreDInsertion({ items, dateOf: (item) => item.date }).map((item) => item.label);

describe('trierParJourPuisOrdreDInsertion', () => {
  test('trie par date quand les jours calendaires sont différents', () => {
    const items: Item[] = [
      { label: 'accord', date: '2023-06-20T00:00:00.000Z' },
      { label: 'notification', date: '2023-01-01T00:00:00.000Z' },
      { label: 'demande', date: '2023-06-15T14:32:00.000Z' },
    ];

    assert.deepEqual(trierLabels(items), ['notification', 'demande', 'accord']);
  });

  test("conserve l'ordre d'entrée quand deux items tombent le même jour, même si l'instant exact est inversé", () => {
    // Si la demande de recours (date calculée au moment de l'action) tombe le même jour que
    // la date de la réponse signée pouvant être antidaté le meme jour que la demande (date picker avec heure à minuit (YYYY-MM-DDT00:00:00.000Z)
    // alors il faut dans ce cas là utiliser l'ordre d'instertion
    const items: Item[] = [
      { label: 'demande', date: '2023-06-15T14:32:00.000Z' },
      { label: 'accord', date: '2023-06-15T00:00:00.000Z' },
    ];

    assert.deepEqual(trierLabels(items), ['demande', 'accord']);
  });

  test('ne mute pas le tableau reçu en entrée', () => {
    const items: Item[] = [
      { label: 'b', date: '2023-06-20T00:00:00.000Z' },
      { label: 'a', date: '2023-01-01T00:00:00.000Z' },
    ];

    trierParJourPuisOrdreDInsertion({ items, dateOf: (item) => item.date });

    assert.deepEqual(
      items.map((item) => item.label),
      ['b', 'a'],
    );
  });
});
