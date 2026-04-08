import { describe, test } from 'node:test';

import { expect } from 'chai';

import { Candidature } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { Champs } from '../../graphql/index.js';

import { getRaccordements } from './getRaccordements.js';

describe(`Projet avec raccordement`, () => {
  test(`Doit retourner les raccordements au format du dépôt de candidature`, () => {
    const champs: Champs = [
      {
        id: '1',
        champDescriptorId: '1',
        __typename: 'RepetitionChamp',
        label:
          'Pour chaque référence de raccordement, ajouter un bloc contenant les informations correspondantes',
        stringValue: '',
        updatedAt: '2026-04-07T14:25:10+02:00',
        prefilled: false,
        rows: [
          {
            champs: [
              {
                __typename: 'CheckboxChamp',
                label: 'Est-ce que la demande de raccordement est faite sur le réseau Enedis ?',
                stringValue: 'true',
              },
              {
                __typename: 'TextChamp',
                label: 'Référence du dossier de raccordement',
                stringValue: 'RAC-XXX-25-999999 ',
              },
              {
                __typename: 'DateChamp',
                label: "Date de l'accusé de réception de la demande de raccordement",
                stringValue: '01 avril 2026',
              },
            ],
          },
          {
            champs: [
              {
                __typename: 'CheckboxChamp',
                label: 'Est-ce que la demande de raccordement est faite sur le réseau Enedis ?',
                stringValue: 'false',
              },
              {
                __typename: 'TextChamp',
                label: 'Référence du dossier de raccordement',
                stringValue: 'test',
              },
              {
                __typename: 'DateChamp',
                label: "Date de l'accusé de réception de la demande de raccordement",
                stringValue: '31 mars 2026',
              },
            ],
          },
        ],
      },
    ];
    const actual = getRaccordements(champs);
    const expected: Candidature.Dépôt.RawType['raccordements'] = [
      {
        référence: 'RAC-XXX-25-999999',
        dateQualification: DateTime.convertirEnValueType(new Date('2026-04-01')).formatter(),
      },
      {
        référence: 'test',
        dateQualification: DateTime.convertirEnValueType(new Date('2026-03-31')).formatter(),
      },
    ];
    expect(actual).to.deep.equal(expected);
  });
});
