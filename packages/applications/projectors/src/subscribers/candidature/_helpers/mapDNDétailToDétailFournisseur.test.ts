import test from 'node:test';

import { expect } from 'chai';

import { mapDNDétailToDétailFournisseur } from './mapDNDétailToDétailFournisseur.js';

test('Convertir les détails du projet en fournisseurs pour un projet Eolien', () => {
  const détail = {
    'Coût total du lot': '3.141',
    'Contenu local français': '3.141',
    'Contenu local européen (y compris français)': '3.141',
    'Poste de conversion - Nom du fabricant - 1': 'FAB-PC',
    'Poste de conversion - Pays de fabrication - 1': 'AUTRICHE',
    'Dispositif de production - Nom du fabricant - 1': 'EMERSON',
    'Dispositif de production - Nom du fabricant - 2': 'VESTAS',
    'Dispositif de production - Pays de fabrication - 1': 'AUTRICHE',
    'Dispositif de production - Pays de fabrication - 2': 'ALBANIE, ALLEMAGNE',
    'Dispositif de production - Référence commerciale du fabricant - 1': 'ref1',
    'Dispositif de production - Référence commerciale du fabricant - 2': 'ref2',
    'Stockage - Nom du fabricant': 'FAB-S',
    'Stockage - Pays de fabrication': 'ARGENTINE',
    'Développement - Coût total du lot': '30',
    'Développement - Contenu local français': '20',
    'Développement - Contenu local européen (y compris français)': '20',
    'Turbine - Coût total du lot': '50',
  };

  const expected = [
    {
      typeFournisseur: 'poste-conversion',
      nomDuFabricant: 'FAB-PC',
      lieuDeFabrication: 'AUTRICHE',
    },
    {
      typeFournisseur: 'dispositif-de-production',
      nomDuFabricant: 'EMERSON',
      lieuDeFabrication: 'AUTRICHE',
      référenceCommerciale: 'ref1',
    },
    {
      typeFournisseur: 'dispositif-de-production',
      nomDuFabricant: 'VESTAS',
      lieuDeFabrication: 'ALBANIE, ALLEMAGNE',
      référenceCommerciale: 'ref2',
    },
    {
      typeFournisseur: 'stockage',
      nomDuFabricant: 'FAB-S',
      lieuDeFabrication: 'ARGENTINE',
    },
    {
      typeFournisseur: 'développement',
      coûtTotalLot: '30',
      contenuLocalFrançais: '20',
      contenuLocalEuropéen: '20',
    },
    {
      typeFournisseur: 'turbine',
      coûtTotalLot: '50',
    },
  ];

  const result = mapDNDétailToDétailFournisseur(détail);
  expect(result).to.have.lengthOf(expected.length);
  expect(result).to.have.deep.members(expected);
});

test('Convertir les détails du projet en fournisseurs pour un projet PV', () => {
  const détail = {
    'Coût total du lot': '3.141',
    'Contenu local français': '3.141',
    'Contenu local européen (y compris français)': '3.141',
    'Postes de conversion - Nom du fabricant - 1': 'FAB-PC',
    'Postes de conversion - Pays de fabrication - 1': 'AUTRICHE',
    'Composants (modules ou films) photovoltaïques - Nom du fabricant - 1': 'EMERSON',
    'Composants (modules ou films) photovoltaïques - Nom du fabricant - 2': 'VESTAS',
    'Composants (modules ou films) photovoltaïques - Pays de fabrication - 1': 'AUTRICHE',
    'Composants (modules ou films) photovoltaïques - Pays de fabrication - 2': 'ALBANIE, ALLEMAGNE',
    'Composants (modules ou films) photovoltaïques - Référence commerciale du fabricant - 1':
      'ref1',
    'Composants (modules ou films) photovoltaïques - Référence commerciale du fabricant - 2':
      'ref2',
    'Stockage - Nom du fabricant': 'FAB-S',
    'Stockage - Pays de fabrication': 'ARGENTINE',
    'Suivi de la course du soleil - Nom du fabricant': 'FAB-SCS',
    'Suivi de la course du soleil - Pays de fabrication': 'FRANCE',
    'Suivi de la course du soleil - Coût total du lot': '100',
    'Suivi de la course du soleil - Contenu local français': '100',
    'Suivi de la course du soleil - Contenu local européen (y compris français)': '100',
  };

  const expected = [
    {
      typeFournisseur: 'postes-conversion',
      nomDuFabricant: 'FAB-PC',
      lieuDeFabrication: 'AUTRICHE',
    },
    {
      typeFournisseur: 'module-ou-films',
      nomDuFabricant: 'EMERSON',
      lieuDeFabrication: 'AUTRICHE',
      référenceCommerciale: 'ref1',
    },
    {
      typeFournisseur: 'module-ou-films',
      nomDuFabricant: 'VESTAS',
      lieuDeFabrication: 'ALBANIE, ALLEMAGNE',
      référenceCommerciale: 'ref2',
    },
    {
      typeFournisseur: 'stockage',
      nomDuFabricant: 'FAB-S',
      lieuDeFabrication: 'ARGENTINE',
    },
    {
      typeFournisseur: 'dispositifs-suivi-course-soleil',
      nomDuFabricant: 'FAB-SCS',
      lieuDeFabrication: 'FRANCE',
      coûtTotalLot: '100',
      contenuLocalFrançais: '100',
      contenuLocalEuropéen: '100',
    },
  ];

  const result = mapDNDétailToDétailFournisseur(détail);
  expect(result).to.have.lengthOf(expected.length);
  expect(result).to.have.deep.members(expected);
});
