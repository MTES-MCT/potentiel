import { describe, test } from 'node:test';

import { expect } from 'chai';

import { Candidature } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { Champs } from './graphql';
import { getTypologieInstallation } from './getTypologieInstallation';

const baseChamp = {
  id: '1',
  champDescriptorId: 'TEST',
  prefilled: false,
  updatedAt: DateTime.now().formatter(),
};

describe(`Projet avec typologie "Bâtiment"`, () => {
  test(`Doit récupérer la typologie d'installation bâtiment neuf`, () => {
    const data: Champs = [
      {
        ...baseChamp,
        __typename: 'TextChamp',
        label: 'Typologie secondaire du projet (Bâtiment)',
        stringValue: 'Bâtiment neuf',
      },
    ];

    const actual = getTypologieInstallation(data);
    const expected: Array<Candidature.TypologieInstallation.RawType> = [
      { typologie: 'bâtiment.neuf' },
    ];
    expect(actual).to.deep.equal(expected);
  });

  test(`Doit récupérer la typologie d'installation bâtiment existant avec rénovation de toiture`, () => {
    const data: Champs = [
      {
        ...baseChamp,
        __typename: 'TextChamp',
        label: 'Typologie secondaire du projet (Bâtiment)',
        stringValue: 'Bâtiment existant avec rénovation de toiture',
      },
    ];

    const actual = getTypologieInstallation(data);
    const expected: Candidature.Dépôt.RawType['typologieInstallation'] = [
      { typologie: 'bâtiment.existant-avec-rénovation-de-toiture' },
    ];
    expect(actual).to.deep.equal(expected);
  });

  test(`Doit récupérer la typologie d'installation bâtiment existant sans rénovation de toiture`, () => {
    const data: Champs = [
      {
        ...baseChamp,
        __typename: 'TextChamp',
        label: 'Typologie secondaire du projet (Bâtiment)',
        stringValue: 'Bâtiment existant sans rénovation de toiture',
      },
    ];

    const actual = getTypologieInstallation(data);
    const expected: Candidature.Dépôt.RawType['typologieInstallation'] = [
      { typologie: 'bâtiment.existant-sans-rénovation-de-toiture' },
    ];
    expect(actual).to.deep.equal(expected);
  });
});

describe(`Projet avec typologie "Ombrière"`, () => {
  test(`Doit récupérer la typologie d'installation pour un projet "ombrière sur parking"`, () => {
    const data: Champs = [
      {
        ...baseChamp,
        updatedAt: DateTime.now().formatter(),
        __typename: 'TextChamp',
        label: 'Typologie secondaire du projet (Ombrière)',
        stringValue: 'Ombrière sur parking',
      },
    ];

    const actual = getTypologieInstallation(data);
    const expected: Array<Candidature.TypologieInstallation.RawType> = [
      { typologie: 'ombrière.parking' },
    ];
    expect(actual).to.deep.equal(expected);
  });

  test(`Doit récupérer la typologie d'installation pour un projet "ombrière autre"`, () => {
    const data: Champs = [
      {
        ...baseChamp,
        __typename: 'TextChamp',
        label: 'Typologie secondaire du projet (Ombrière)',
        stringValue: 'Ombrière autre',
      },
      {
        ...baseChamp,
        __typename: 'TextChamp',
        label: "Préciser les éléments sous l'ombrière",
        stringValue: 'les éléments...',
      },
    ];

    const actual = getTypologieInstallation(data);
    const expected: Array<Candidature.TypologieInstallation.RawType> = [
      { typologie: 'ombrière.autre', détails: 'les éléments...' },
    ];
    expect(actual).to.deep.equal(expected);
  });

  test(`Doit récupérer la typologie d'installation pour un projet "Ombrière mixte (sur parking et autre)"`, () => {
    const data: Champs = [
      {
        ...baseChamp,
        __typename: 'TextChamp',
        label: 'Typologie secondaire du projet (Ombrière)',
        stringValue: 'Ombrière mixte (sur parking et autre)',
      },
      {
        ...baseChamp,
        __typename: 'TextChamp',
        label: "Préciser les éléments sous l'ombrière",
        stringValue: 'les éléments...',
      },
    ];

    const actual = getTypologieInstallation(data);
    const expected: Array<Candidature.TypologieInstallation.RawType> = [
      { typologie: 'ombrière.mixte', détails: 'les éléments...' },
    ];
    expect(actual).to.deep.equal(expected);
  });
});

describe(`Projet avec typologie "Serre"`, () => {
  test(`Doit récupérer la typologie d'installation pour un projet "serre"`, () => {
    const data: Champs = [
      {
        ...baseChamp,
        updatedAt: DateTime.now().formatter(),
        __typename: 'TextChamp',
        label: 'Préciser les éléments sous la serre',
        stringValue: 'éléments sous serre',
      },
    ];

    const actual = getTypologieInstallation(data);
    const expected: Array<Candidature.TypologieInstallation.RawType> = [
      { typologie: 'serre', détails: 'éléments sous serre' },
    ];
    expect(actual).to.deep.equal(expected);
  });
});

describe(`Projet avec typologie "Mixte"`, () => {
  test(`Doit récupérer la typologie d'installation pour un projet "mixte"`, () => {
    const data: Champs = [
      {
        ...baseChamp,
        __typename: 'TextChamp',
        label: 'Typologie secondaire du projet (Projet mixte) - Ombrière',
        stringValue: 'Ombrière autre',
      },
      {
        ...baseChamp,
        __typename: 'TextChamp',
        label: "Préciser les éléments sous l'ombrière",
        stringValue: 'les éléments...',
      },
      {
        ...baseChamp,
        __typename: 'TextChamp',
        label: 'Typologie secondaire du projet (Projet mixte) - Bâtiment ',
        stringValue: 'Bâtiment existant avec rénovation de toiture ',
      },
      {
        ...baseChamp,
        updatedAt: DateTime.now().formatter(),
        __typename: 'TextChamp',
        label: 'Typologie du projet (Projet mixte) - Serre ',
        stringValue: 'éléments sous serre',
      },
    ];

    const actual = getTypologieInstallation(data);
    const expected: Array<Candidature.TypologieInstallation.RawType> = [
      {
        typologie: 'bâtiment.existant-avec-rénovation-de-toiture',
      },
      { typologie: 'ombrière.autre', détails: 'les éléments...' },
      { typologie: 'serre', détails: 'éléments sous serre' },
    ];

    expect(actual).to.deep.equal(expected);
  });
});
