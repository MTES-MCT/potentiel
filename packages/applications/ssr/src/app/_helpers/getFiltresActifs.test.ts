import test, { describe } from 'node:test';

import { expect } from 'chai';

import { getFiltresActifs } from './getFiltresActifs';

describe('getFiltresActifs', () => {
  test('Doit retourner un objet qui contient uniquement les filtres actifs', () => {
    const filtres = {
      appelOffre: undefined,
      periode: [],
      statut: 'actif',
      typeActionnariat: ['gouvernance-partagée', 'financement-participatif'],
    };

    const expected = {
      statut: 'actif',
      typeActionnariat: ['gouvernance-partagée', 'financement-participatif'],
    };

    const actual = getFiltresActifs(filtres);

    expect(actual).to.deep.equal(expected);
  });
});
