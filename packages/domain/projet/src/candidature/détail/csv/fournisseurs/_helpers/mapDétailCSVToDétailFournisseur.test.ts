import test from 'node:test';

import { expect } from 'chai';

import { Candidature } from '../../../../..';

import { mapDétailCSVToDétailFournisseur } from './mapDétailCSVToDétailFournisseur';

test('mapDétailCSVToDétailFournisseur - Fournisseur autres technologies   ', () => {
  const détail = {
    'Nom du fabricant (Autres technologies)': 'CCC',
    'Lieu(x) de fabrication (Autres technologies)': 'France',

    'Nom du fabricant (Autres technologies) 1': 'DDD',
    'Lieu(x) de fabrication (Autres technologies) 1': 'Allemagne',

    'Nom du fabricant (Autres technologies) 2': 'EEE',
    'Lieu(x) de fabrication (Autres technologies) 2': 'Etats-Unis',

    'Nom du fabricant (Autres technologies) 3': 'FFF',
    'Lieu(x) de fabrication (Autres technologies) 3': 'France',

    'Nom du fabricant (Autres technologies) 4': 'GGG',
    'Lieu(x) de fabrication (Autres technologies) 4': 'Italie',

    'Contenu local européen (%) (Autres technologies)': '10',
    'Contenu local français (%) (Autres technologies)': '60',
    'Coût total du lot (M€) (Plaquettes de silicium (wafers))': '5',
    'Coût total du lot (M€) (génie civil)': '8',

    // non normalisé (à traiter)
    'Contenu local Fabrication de composants et assemblage : Pourcentage de contenu local européen':
      '10',
    'Contenu local Fabrication de composants et assemblage : Pourcentage de contenu local français':
      '60',
    'Contenu local Fabrication de composants et assemblage : Total coût du lot': '42',

    // ??
    'Référence commerciale (Autres technologies)': 'Ref-AT-12345',
  };

  const expected: Array<Candidature.DétailFournisseur> = [
    {
      typeFournisseur: 'autres-technologies',
      nomDuFabricant: 'CCC',
      lieuDeFabrication: 'France',
      contenuLocalFrançais: '60',
      contenuLocalEuropéen: '10',
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
  ];

  const actual = mapDétailCSVToDétailFournisseur(détail);

  expect(actual).to.deep.equal(expected);
});
