import { test } from 'node:test';
import { readFileSync } from 'node:fs';

import { z } from 'zod';
import { expect } from 'chai';

import { fromCSV } from './fromCSV.js';
import { DuplicateHeaderError } from './checkDuplicateHeaders.js';
import { MissingRequiredColumnError } from './checkRequiredColumns.js';

const schema = z.object({
  identifiantProjet: z.string(),
  referenceDossier: z.string(),
  referenceDossierCorrigee: z.string(),
});

const readFixture = (name: string) => {
  const data = readFileSync(`${import.meta.dirname}/fixtures/${name}`);

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

test(`Étant donné un fichier avec une colonne manquante
  Quand on parse le fichier en spécifiant les colonnes requises
  Alors le fichier ne peut pas être parsé
  Et le label de la colonne manquante est retourné`, async () => {
  const readableStream = readFixture('windows1252.csv');
  const requiredColumns: ReadonlyArray<string> = [
    'identifiantProjet',
    'referenceDossier',
    'nomProjet',
  ];
  try {
    await fromCSV(readableStream, schema, { delimiter: ';' }, requiredColumns);
    expect.fail('did not throw');
  } catch (e) {
    expect(e).to.be.instanceOf(MissingRequiredColumnError);
    expect((e as MissingRequiredColumnError).message).to.match(
      /Des colonnes sont manquantes dans le fichier CSV/,
    );
    expect((e as MissingRequiredColumnError).errors[0].column).to.equal('nomProjet');
  }
});

test(`Étant donné un fichier avec deux colonnes identiques
  Quand on parse le fichier
  Alors le fichier ne peut pas être parsé
  Et une erreur est retournée avec le label de colonne en doublon`, async () => {
  const readableStream = readFixture('col-doublon.csv');

  try {
    await fromCSV(readableStream, schema, { delimiter: ';' });
    expect.fail('did not throw');
  } catch (e) {
    expect(e).to.be.instanceOf(DuplicateHeaderError);
    expect((e as DuplicateHeaderError).message).to.match(
      /Des colonnes sont en doublon dans le fichier CSV/,
    );
    expect((e as DuplicateHeaderError).errors[0].column).to.equal('identifiantProjet');
  }
});
