import test from 'node:test';

import { expect } from 'chai';

import { Lauréat } from '@potentiel-domain/projet';

import { mapCsvRowToFournisseurs } from './fournisseurCsv';

test('convertir la liste de fournisseur depuis le CSV', () => {
  const expected: Array<Lauréat.Fournisseur.Fournisseur.RawType> = [
    { typeFournisseur: 'cellules', nomDuFabricant: 'AAA', lieuDeFabrication: 'Chine' },
    {
      typeFournisseur: 'plaquettes-silicium',
      nomDuFabricant: 'silicium 1',
      lieuDeFabrication: 'Chine',
    },
    { typeFournisseur: 'cellules', nomDuFabricant: 'BBB', lieuDeFabrication: 'Italie' },
    {
      typeFournisseur: 'plaquettes-silicium',
      nomDuFabricant: 'silicium 2',
      lieuDeFabrication: 'France',
    },
    { typeFournisseur: 'module-ou-films', nomDuFabricant: 'module 1', lieuDeFabrication: 'Canada' },
  ];

  const fournisseurs = mapCsvRowToFournisseurs({
    'Nom du fabricant (Cellules) 1': 'AAA',
    'Nom du fabricant \n(Plaquettes de silicium (wafers)) 1': 'silicium 1',
    'Lieu(x) de fabrication (Cellules) 2': 'Italie',
    'Nom du fabricant \n(Plaquettes de silicium (wafers)) 2': 'silicium 2',
    'Nom du fabricant (Cellules) 2': 'BBB',
    'Lieu(x) de fabrication \n(Plaquettes de silicium (wafers)) 1': 'Chine',
    'Lieu(x) de fabrication (Cellules) 1': 'Chine',
    'Lieu(x) de fabrication \n(Plaquettes de silicium (wafers)) 2': 'France',
    'Nom du fabricant \n(Modules ou films) 1': 'module 1',
    'Lieu(x) de fabrication \n(Modules ou films) 1': 'Canada',
  });

  expect(fournisseurs).to.deep.eq(expected);
});
