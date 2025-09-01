import { describe, test } from 'node:test';

import { expect } from 'chai';
import { match } from 'ts-pattern';

import { Candidature } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { Champs } from './graphql';

// import { getTypologieInstallation } from './specialFields';

const getTypologieInstallation = (champs: Champs) => {
  let typologieBâtiment: Candidature.TypologieInstallation.RawType | undefined = undefined;
  let typologieOmbrière: Partial<Candidature.TypologieInstallation.RawType> | undefined = undefined;

  for (const champ of champs) {
    if (champ.__typename === 'TextChamp') {
      const label = champ.label.trim().toLowerCase();

      if (label === 'typologie secondaire du projet (bâtiment)') {
        typologieBâtiment = match(champ.stringValue?.trim().toLowerCase())
          .returnType<Candidature.TypologieInstallation.RawType | undefined>()
          .with('bâtiment neuf', () => ({
            typologie: 'bâtiment.neuf',
          }))
          .with('bâtiment existant avec rénovation de toiture', () => ({
            typologie: 'bâtiment.existant-avec-rénovation-de-toiture',
          }))
          .with('bâtiment existant sans rénovation de toiture', () => ({
            typologie: 'bâtiment.existant-sans-rénovation-de-toiture',
          }))
          .otherwise(() => undefined);
      } else if (label === 'typologie secondaire du projet (ombrière)') {
        const typologie = match(champ.stringValue?.trim().toLowerCase())
          .returnType<Partial<Candidature.TypologieInstallation.RawType> | undefined>()
          .with('ombrière sur parking', () => ({
            typologie: 'ombrière.parking',
          }))
          .with('ombrière autre', () => ({
            typologie: 'ombrière.autre',
          }))
          .with('ombrière mixte (sur parking et autre)', () => ({
            typologie: 'ombrière.mixte',
          }))
          .otherwise(() => undefined);
        if (!typologieOmbrière) {
          typologieOmbrière = typologie;
        } else if (typologie) {
          typologieOmbrière.typologie = typologie.typologie;
        }
      } else if (label === "préciser les éléments sous l'ombrière") {
        if (!typologieOmbrière) {
          typologieOmbrière = {
            détails: champ.stringValue?.trim(),
          };
        } else {
          typologieOmbrière.détails = champ.stringValue?.trim();
        }
      }
    }
  }
  return [typologieBâtiment, typologieOmbrière].filter(
    (t): t is Candidature.TypologieInstallation.RawType => t !== undefined,
  );
};

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

describe(`Projet avec typologie "Serre"`, () => {});
describe(`Projet avec typologie "Mixte"`, () => {});
