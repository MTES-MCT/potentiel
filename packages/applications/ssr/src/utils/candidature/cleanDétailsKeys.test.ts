import { describe, it } from 'node:test';

import { expect } from 'chai';

import { cleanDétailsKeys } from './cleanDétailsKeys';

describe('cleanDétailsEntries', () => {
  it('Doit supprimer les retours à la ligne dans les clés', () => {
    const data = {
      'Avis\n(pièce n°1)': 'Pièce 1',
      'Contenu local européen (%)\n(Installation et mise en service) ': '75%',
      Département: 'Île-de-France',
      'Avis \n(pièce n°3)': 'Pièce 3',
    };

    const expectedDétail = {
      'Avis (pièce n°1)': 'Pièce 1',
      'Contenu local européen (%) (Installation et mise en service)': '75%',
      Département: 'Île-de-France',
      'Avis (pièce n°3)': 'Pièce 3',
    };

    const result = cleanDétailsKeys(data);

    expect(result).to.deep.equal(expectedDétail);
  });

  it(`Doit supprimer les espaces en début et fin des clés`, () => {
    const data = {
      '  Avis (pièce n°1)  ': 'Pièce 1',
      '  Avis (pièce n°2) ': 'Pièce 2',
      ' Contenu local européen (%) (Installation et mise en service) ': '75%',
      ' Département ': 'Île-de-France',
    };

    const expectedDétail = {
      'Avis (pièce n°1)': 'Pièce 1',
      'Avis (pièce n°2)': 'Pièce 2',
      'Contenu local européen (%) (Installation et mise en service)': '75%',
      Département: 'Île-de-France',
    };

    const result = cleanDétailsKeys(data);

    expect(result).to.deep.equal(expectedDétail);
  });

  it(`Doit remplacer les multiples espaces par un seul espace dans les clés`, () => {
    const data = {
      'Avis    (pièce n°1)': 'Pièce 1',
      'Avis   (pièce n°2)': 'Pièce 2',
      'Contenu   local   européen (%)   (Installation et mise en service)': '75%',
    };

    const expectedDétail = {
      'Avis (pièce n°1)': 'Pièce 1',
      'Avis (pièce n°2)': 'Pièce 2',
      'Contenu local européen (%) (Installation et mise en service)': '75%',
    };

    const result = cleanDétailsKeys(data);

    expect(result).to.deep.equal(expectedDétail);
  });
});
