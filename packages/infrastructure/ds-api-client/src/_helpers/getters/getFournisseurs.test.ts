import { describe, test } from 'node:test';

import { expect } from 'chai';

import { Candidature } from '@potentiel-domain/projet';

import { Champs } from '../../graphql/index.js';

import { getFournisseurs } from './getFournisseurs.js';

describe(`Projet avec fournisseurs`, () => {
  test(`Doit retourner les fournisseurs au format du dépôt de candidature`, () => {
    const champs: Champs = [
      {
        __typename: 'RepetitionChamp',
        label:
          'Pour chaque fabricant de dispositif de production, ajouter un bloc contenant les informations du fabricant:',
        stringValue: '',
        rows: [
          {
            champs: [
              {
                __typename: 'TextChamp',
                label: 'Dispositif de production - Nom du fabricant',
                stringValue: 'nom fabricant 1',
              },
              {
                __typename: 'TextChamp',
                label: 'Dispositif de production - Référence commerciale du fabricant',
                stringValue: 'ref 1',
              },
              {
                __typename: 'MultipleDropDownListChamp',
                label: 'Dispositif de production - Pays de fabrication',
                stringValue: 'CHILI, CHINE',
              },
            ],
          },
          {
            champs: [
              {
                __typename: 'TextChamp',
                label: 'Dispositif de production - Nom du fabricant',
                stringValue: 'nom fabricant 2',
              },
              {
                __typename: 'TextChamp',
                label: 'Dispositif de production - Référence commerciale du fabricant',
                stringValue: 'ref 2',
              },
              {
                __typename: 'MultipleDropDownListChamp',
                label: 'Dispositif de production - Pays de fabrication',
                stringValue: 'FRANCE',
              },
            ],
          },
        ],
      },
      {
        __typename: 'RepetitionChamp',
        label:
          'Pour chaque poste de conversion, ajouter un bloc contenant les informations du poste de conversion:',
        stringValue: '',

        rows: [
          {
            champs: [
              {
                __typename: 'TextChamp',
                label: 'Poste de conversion - Nom du fabricant',
                stringValue: 'nom fabricant 3',
              },
              {
                __typename: 'MultipleDropDownListChamp',
                label: 'Poste de conversion - Pays de fabrication',
                stringValue: 'ÎLES COOK',
              },
            ],
          },
        ],
      },
      {
        __typename: 'TextChamp',
        label: 'Stockage - Nom du fabricant',
        stringValue: 'nom fabricant 4',
      },
      {
        __typename: 'MultipleDropDownListChamp',
        label: 'Stockage - Pays de fabrication',
        stringValue: 'ANTIGUA-ET-BARBUDA',
      },
    ];
    const actual = getFournisseurs(champs);
    const expected: Candidature.Dépôt.RawType['fournisseurs'] = [
      {
        typeFournisseur: 'dispositif-de-production',
        nomDuFabricant: 'nom fabricant 1',
        lieuDeFabrication: 'CHILI, CHINE',
      },
      {
        typeFournisseur: 'dispositif-de-production',
        nomDuFabricant: 'nom fabricant 2',
        lieuDeFabrication: 'FRANCE',
      },
      {
        typeFournisseur: 'poste-conversion',
        nomDuFabricant: 'nom fabricant 3',
        lieuDeFabrication: 'ÎLES COOK',
      },
      {
        typeFournisseur: 'dispositif-de-stockage',
        nomDuFabricant: 'nom fabricant 4',
        lieuDeFabrication: 'ANTIGUA-ET-BARBUDA',
      },
    ];
    expect(actual).to.deep.equal(expected);
  });
});
