import test from 'node:test';

import { expect } from 'chai';

import { Candidature } from '@potentiel-domain/projet';

import { mapCsvRowToFournisseurs } from './fournisseurCsv';

test("convertir la typologie d'installation depuis le CSV", () => {
  const expected: Candidature.Dépôt.RawType['typologieInstallation'] = [
    { typologie: 'bâtiment.neuf' },
    { typologie: 'ombrière.autre', détails: 'aire de jeux municipale' },
  ];

  const typologieInstallation = mapCsvRowToFournisseurs({
    'Installations agrivoltaïques': '',
    'Eléments sous l’ombrière': 'aire de jeux municipale',
    'Typologie de bâtiment': 'Bâtiment neuf',
  });

  expect(typologieInstallation).to.deep.eq(expected);
});
