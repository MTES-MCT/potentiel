import test from 'node:test';

import { expect } from 'chai';

import { Candidature } from '../../../../..';

import { mapDétailCSVToDétailFournisseur } from './mapDétailCSVToDétailFournisseur';

test('mapDétailCSVToDétailFournisseur - Mélange de fournisseur avec des données complètes  ', () => {
  const détail = {
    'Nom du fabricant (Autres technologies)': 'CCC',
    'Lieu(x) de fabrication (Autres technologies)': 'France',
    'Contenu local européen (%) (Autres technologies)': '10',
    'Contenu local français (%) (Autres technologies)': '60',
    // À garder ??
    'Référence commerciale (Autres technologies)': 'Ref-AT-12345',

    'Nom du fabricant (Autres technologies) 1': 'DDD',
    'Lieu(x) de fabrication (Autres technologies) 1': 'Allemagne',

    'Nom du fabricant (Autres technologies) 2': 'EEE',
    'Lieu(x) de fabrication (Autres technologies) 2': 'Etats-Unis',

    'Nom du fabricant (Autres technologies) 3': 'FFF',
    'Lieu(x) de fabrication (Autres technologies) 3': 'France',

    'Nom du fabricant (Autres technologies) 4': 'GGG',
    'Lieu(x) de fabrication (Autres technologies) 4': 'Italie',

    'Coût total du lot (M€) (Plaquettes de silicium (wafers))': '5',
    'Coût total du lot (M€) (génie civil)': '8',

    'Contenu local Fabrication de composants et assemblage : Pourcentage de contenu local européen':
      '10',
    'Contenu local Fabrication de composants et assemblage : Pourcentage de contenu local français':
      '60',
    'Contenu local Fabrication de composants et assemblage : Total coût du lot': '42',

    'Contenu local européen (%) (Modules ou films)': '0.01',
    'Rendement nominal (Modules ou films)': '15%',
  };

  const expected: Array<Candidature.DétailFournisseur> = [
    {
      typeFournisseur: 'autres-technologies',
      nomDuFabricant: 'CCC',
      lieuDeFabrication: 'France',
      contenuLocalFrançais: '60',
      contenuLocalEuropéen: '10',
      référenceCommerciale: 'Ref-AT-12345',
    },
    {
      typeFournisseur: 'autres-technologies',
      nomDuFabricant: 'DDD',
      lieuDeFabrication: 'Allemagne',
    },
    {
      typeFournisseur: 'autres-technologies',
      nomDuFabricant: 'EEE',
      lieuDeFabrication: 'Etats-Unis',
    },
    {
      typeFournisseur: 'autres-technologies',
      nomDuFabricant: 'FFF',
      lieuDeFabrication: 'France',
    },
    {
      typeFournisseur: 'autres-technologies',
      nomDuFabricant: 'GGG',
      lieuDeFabrication: 'Italie',
    },
    {
      typeFournisseur: 'plaquettes-silicium',
      coûtTotalLot: '5',
    },
    {
      typeFournisseur: 'génie-civil',
      coûtTotalLot: '8',
    },
    {
      typeFournisseur: 'fabrication-de-composants-et-assemblage',
      contenuLocalEuropéen: '10',
      contenuLocalFrançais: '60',
      coûtTotalLot: '42',
    },
    {
      typeFournisseur: 'module-ou-films',
      contenuLocalEuropéen: '0.01',
      rendementNominal: '15%',
    },
  ];

  const actual = mapDétailCSVToDétailFournisseur(détail);

  expect(actual).to.deep.equal(expected);
});

test('mapDétailCSVToDétailFournisseur - Mélange de fournisseur avec des données incomplètes  ', () => {
  const détail = {
    'Nom du fabricant (Autres technologies)': '',
    'Lieu(x) de fabrication (Autres technologies)': '',
    'Contenu local européen (%) (Autres technologies)': '10',
    'Contenu local français (%) (Autres technologies)': '60',
    'Référence commerciale (Autres technologies)': 'Ref-AT-12345',
    'Contenu local Fabrication de composants et assemblage : Pourcentage de contenu local européen':
      '',
    'Contenu local Fabrication de composants et assemblage : Total coût du lot': '42',
  };

  const expected: Array<Candidature.DétailFournisseur> = [
    {
      typeFournisseur: 'autres-technologies',
      contenuLocalFrançais: '60',
      contenuLocalEuropéen: '10',
      référenceCommerciale: 'Ref-AT-12345',
    },
    {
      typeFournisseur: 'fabrication-de-composants-et-assemblage',
      coûtTotalLot: '42',
    },
  ];

  const actual = mapDétailCSVToDétailFournisseur(détail);

  expect(actual).to.deep.equal(expected);
});
