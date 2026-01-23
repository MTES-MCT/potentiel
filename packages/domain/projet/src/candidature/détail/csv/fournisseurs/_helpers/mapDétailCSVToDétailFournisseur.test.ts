import test from 'node:test';

import { expect } from 'chai';

import { Candidature } from '../../../../..';

import { mapDétailCSVToDétailFournisseur } from './mapDétailCSVToDétailFournisseur';

test(`mapDétailCSVToDétailFournisseur`, () => {});

test('mapDétailCSVToDétailFournisseur - cas de base', () => {
  const détail = {
    'Nom du fabricant (Cellules)': 'AAA',
    'Nom du fabricant (Cellules) 1': 'BBB',
    'Nom du fabricant (Cellules) 2': 'CCC',
    'Lieu(x) de fabrication (Cellules)': 'Chine',
    'Lieu(x) de fabrication (Cellules) 1': 'Japon',
    'Lieu(x) de fabrication (Cellules) 2': 'Italie',
  };

  const expected: Array<Candidature.DétailFournisseur> = [
    {
      typeFournisseur: 'cellules',
      nomDuFabricant: 'AAA',
      lieuDeFabrication: 'Chine',
      coûtTotalLot: '',
      contenuLocalFrançais: '',
      contenuLocalEuropéen: '',
      puissanceCrêteWc: '',
      rendementNominal: '',
      technologie: '',
    },
    {
      typeFournisseur: 'cellules',
      nomDuFabricant: 'BBB',
      lieuDeFabrication: 'Japon',
      coûtTotalLot: '',
      contenuLocalFrançais: '',
      contenuLocalEuropéen: '',
      puissanceCrêteWc: '',
      rendementNominal: '',
      technologie: '',
    },
    {
      typeFournisseur: 'cellules',
      nomDuFabricant: 'CCC',
      lieuDeFabrication: 'Italie',
      coûtTotalLot: '',
      contenuLocalFrançais: '',
      contenuLocalEuropéen: '',
      puissanceCrêteWc: '',
      rendementNominal: '',
      technologie: '',
    },
    {
      typeFournisseur: 'polysilicium',
      nomDuFabricant: 'CCC',
      lieuDeFabrication: 'Etats-Unis',
      coûtTotalLot: '',
      contenuLocalFrançais: '',
      contenuLocalEuropéen: '',
      puissanceCrêteWc: '',
      rendementNominal: '',
      technologie: '',
    },
  ];

  const actual = mapDétailCSVToDétailFournisseur(détail);

  expect(actual).to.deep.equal(expected);
});

test('mapDétailCSVToDétailFournisseur - champs manquants', () => {});

test('mapDétailCSVToDétailFournisseur - champs supplémentaires', () => {
  const détail = {
    'Nom du fabricant (Cellules)': 'AAA',
    'Lieu(x) de fabrication (Cellules)': 'Chine',
    'Coût total du lot (Cellules)': '1.5',
    'Contenu local français (Cellules)': '20',
    'Technologie (Cellules)': 'Mono',
    'Puissance crête Wc (Cellules)': '400',
    'Rendement nominal (Cellules)': '19',
  };

  const actual: Array<Candidature.DétailFournisseur> = [
    {
      typeFournisseur: 'cellules',
      nomDuFabricant: 'AAA',
      lieuDeFabrication: 'Chine',
      coûtTotalLot: '1.5',
      contenuLocalFrançais: '20',
      contenuLocalEuropéen: '',
      puissanceCrêteWc: '400',
      rendementNominal: '19',
      technologie: 'Mono',
    },
  ];

  const expected = mapDétailCSVToDétailFournisseur(détail);

  expect(actual).to.deep.equal(expected);
});

test('mapDétailCSVToDétailFournisseur - entrée vide', () => {
  const détail = {};
  const actual: Array<Candidature.DétailFournisseur> = [];
  const expected = mapDétailCSVToDétailFournisseur(détail);

  expect(actual).to.deep.equal(expected);
});
