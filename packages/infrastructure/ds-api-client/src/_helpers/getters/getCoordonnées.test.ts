import { describe, test } from 'node:test';

import { expect } from 'chai';

import { Candidature } from '@potentiel-domain/projet';

import type { Champs } from '../../graphql/accessor.js';

import { getCoordonnées } from './getCoordonnées.js';

describe(`Coordonnées`, () => {
  test(`Doit retourner les coordonnées`, () => {
    const champs: Champs = [
      {
        __typename: 'IntegerNumberChamp',
        label: 'Latitude du barycentre (degrés)',
        integerNumber: 47,
      },
      {
        __typename: 'IntegerNumberChamp',
        label: 'Latitude du barycentre (minutes)',
        integerNumber: 3,
      },
      {
        __typename: 'IntegerNumberChamp',
        label: 'Latitude du barycentre (secondes)',
        integerNumber: 0,
      },
      {
        __typename: 'TextChamp',
        label: 'Latitude du barycentre (point cardinal)',
        stringValue: 'Nord',
      },
      {
        __typename: 'IntegerNumberChamp',
        label: 'Longitude du barycentre (degrés)',
        integerNumber: 1,
      },
      {
        __typename: 'IntegerNumberChamp',
        label: 'Longitude du barycentre (minutes)',
        integerNumber: 25,
      },
      {
        __typename: 'IntegerNumberChamp',
        label: 'Longitude du barycentre (secondes)',
        integerNumber: 0,
      },
      {
        __typename: 'TextChamp',
        label: 'Longitude du barycentre (point cardinal)',
        stringValue: 'Est',
      },
    ];
    const actual = getCoordonnées(champs);
    const expected: Candidature.Dépôt.RawType['coordonnées'] = {
      latitude: 47.05,
      longitude: 1.416667,
    };
    expect(actual).to.deep.equal(expected);
  });
});
