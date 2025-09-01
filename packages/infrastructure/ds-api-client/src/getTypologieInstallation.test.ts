import { describe, test } from 'node:test';

import { expect } from 'chai';
import { match } from 'ts-pattern';

import { Candidature } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { Champs } from './graphql';

// import { z } from 'zod';

// import { Candidature } from '@potentiel-domain/projet';

// import { getTypologieInstallation } from './specialFields';

const getTypologieInstallation = (champs: Champs) => {
  const typologieInstallation: Array<Candidature.TypologieInstallation.RawType> = [];

  for (const champ of champs) {
    if (champ.__typename === 'TextChamp') {
      const label = champ.label.trim().toLowerCase();

      if (label === 'typologie secondaire du projet (bâtiment)') {
        const typologie = match(champ.stringValue?.trim().toLowerCase())
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

        if (typologie) {
          typologieInstallation.push(typologie);
        }
      }
    }
  }

  return typologieInstallation;
};

describe(`Projet avec typologie "Bâtiment"`, () => {
  test(`Doit récupérer la typologie d'installation bâtiment neuf`, () => {
    const data: Champs = [
      {
        id: '1',
        champDescriptorId: 'TEST',
        prefilled: false,
        updatedAt: DateTime.now().formatter(),
        __typename: 'TextChamp',
        label: 'Typologie principale du projet',
        stringValue: 'Installation sur bâtiment',
      },
      {
        id: '2',
        champDescriptorId: 'TEST2',
        prefilled: false,
        updatedAt: DateTime.now().formatter(),
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
        id: '1',
        champDescriptorId: 'TEST',
        prefilled: false,
        updatedAt: DateTime.now().formatter(),
        __typename: 'TextChamp',
        label: 'Typologie principale du projet',
        stringValue: 'Installation sur bâtiment',
      },
      {
        id: '2',
        champDescriptorId: 'TEST2',
        prefilled: false,
        updatedAt: DateTime.now().formatter(),
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
        id: '1',
        champDescriptorId: 'TEST',
        prefilled: false,
        updatedAt: DateTime.now().formatter(),
        __typename: 'TextChamp',
        label: 'Typologie principale du projet',
        stringValue: 'Installation sur bâtiment',
      },
      {
        id: '2',
        champDescriptorId: 'TEST2',
        prefilled: false,
        updatedAt: DateTime.now().formatter(),
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

test(`Doit récupérer la typologie d'installation pour un projet "ombrière"`, () => {});
test(`Doit récupérer la typologie d'installation pour un projet "serre"`, () => {});
test(`Doit récupérer la typologie d'installation pour un projet "mixte"`, () => {});

// test(`Étant donné un fichier séparé par des points-virgules
//   Quand on parse le fichier en spécifiant le séparateur virgule
//   Alors le fichier ne peut pas être parsé`, async () => {
//   const readableStream = readFixture(`utf8.csv`);

//   try {
//     await parseCsv(readableStream, schema, { delimiter: ',' });
//     expect.fail('did not throw');
//   } catch (e) {
//     expect(e).to.be.instanceOf(Error);
//     expect((e as Error).message).to.match(/Erreur lors de la validation du fichier CSV/);
//   }
// });

// const getTypologieInstallation = () => undefined;
