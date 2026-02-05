import { test } from 'node:test';
import { readFileSync } from 'node:fs';

import { z } from 'zod';
import { expect } from 'chai';

import { fromCSV } from './fromCSV.js';

const schema = z.object({
  identifiantProjet: z.string(),
  referenceDossier: z.string(),
  referenceDossierCorrigee: z.string(),
});

const readFixture = (name: string) => {
  const data = readFileSync(`${__dirname}/fixtures/${name}`);

  return new ReadableStream({
    start(controller) {
      controller.enqueue(data);
      controller.close();
    },
  });
};

['utf8', 'windows1252'].forEach((encoding) => {
  test(`Étant donné un fichier csv avec un encoding ${encoding}
    Quand on parse le fichier sans spécifier d'encoding
    ALors les données sont correctement parsées`, async () => {
    const readableStream = readFixture(`${encoding}.csv`);

    const expected = [
      {
        identifiantProjet: 'CRE4 - Autoconsommation métropole#1##2',
        referenceDossier: 'Réfdevis:',
        referenceDossierCorrigee: 'abcd',
      },
      {
        identifiantProjet: 'CRE4 - Bâtiment#1#1#1',
        referenceDossier: 'abcd',
        referenceDossierCorrigee: 'abcd',
      },
    ];

    const { parsedData: actual } = await fromCSV(readableStream, schema);

    expect(actual).to.deep.eq(expected);
  });
});

test(`Étant donné un fichier au format utf8
  Quand on parse le fichier en spécifiant l'encoding windows1252
  Alors les données parsées suivent l'encoding windows1252`, async () => {
  const readableStream = readFixture(`utf8.csv`);

  const {
    parsedData: [actual],
  } = await fromCSV(readableStream, schema, {
    encoding: 'win1252',
  });

  const expected = {
    identifiantProjet: 'CRE4 - Autoconsommation mÃ©tropole#1##2',
    referenceDossier: 'RÃ©fdevis:',
    referenceDossierCorrigee: 'abcd',
  };

  expect(actual).to.deep.eq(expected);
});

test(`Étant donné un fichier séparé par des virgules
  Quand on parse le fichier sans spécifier de séparateur
  Alors les données sont correctement parsées`, async () => {
  const readableStream = readFixture('utf8-comma.csv');
  const expected = [
    {
      identifiantProjet: 'CRE4 - Autoconsommation métropole#1##2',
      referenceDossier: 'Réfdevis;,	',
      referenceDossierCorrigee: 'abcd',
    },
    {
      identifiantProjet: 'CRE4 - Bâtiment#1#1#1',
      referenceDossier: 'abcd',
      referenceDossierCorrigee: 'abcd',
    },
  ];

  const { parsedData: actual } = await fromCSV(readableStream, schema);

  expect(actual).to.deep.eq(expected);
});

test(`Étant donné un fichier séparé par des tabulations
  Quand on parse le fichier sans spécifier de séparateur
  Alors les données sont correctement parsées`, async () => {
  const readableStream = readFixture('utf8-tab.csv');
  const expected = [
    {
      identifiantProjet: 'CRE4 - Autoconsommation métropole#1##2',
      referenceDossier: 'Réfdevis;,	',
      referenceDossierCorrigee: 'abcd',
    },
    {
      identifiantProjet: 'CRE4 - Bâtiment#1#1#1',
      referenceDossier: 'abcd',
      referenceDossierCorrigee: 'abcd',
    },
  ];

  const { parsedData: actual } = await fromCSV(readableStream, schema);

  expect(actual).to.deep.eq(expected);
});

test(`Étant donné un fichier séparé par des points-virgules
  Quand on parse le fichier en spécifiant le séparateur virgule
  Alors le fichier ne peut pas être parsé`, async () => {
  const readableStream = readFixture(`utf8.csv`);

  try {
    await fromCSV(readableStream, schema, { delimiter: ',' });
    expect.fail('did not throw');
  } catch (e) {
    expect(e).to.be.instanceOf(Error);
    expect((e as Error).message).to.match(/Erreur lors de la validation du fichier CSV/);
  }
});
