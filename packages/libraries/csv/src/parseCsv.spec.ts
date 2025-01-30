import { test } from 'node:test';
import { readFileSync } from 'node:fs';

import { z } from 'zod';
import { expect } from 'chai';

import { parseCsv } from './parseCsv';

const schema = z.object({
  identifiantProjet: z.string(),
  referenceDossier: z.string(),
  referenceDossierCorrigee: z.string(),
});

['utf8', 'windows1252'].forEach((encoding) => {
  test(`Étant donné un fichier csv avec un encoding ${encoding}
    Quand on parse le fichier sans spécifier d'encoding
    ALors les données sont correctement parsées`, async () => {
    const data = readFileSync(`${__dirname}/fixtures/${encoding}.csv`);
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(data);
        controller.close();
      },
    });

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

    const { parsedData: actual } = await parseCsv(readableStream, schema);

    expect(actual).to.deep.eq(expected);
  });
});

test(`Étant donné un fichier au format utf8
  Quand on parse le fichier en spécifiant l'encoding windows1252
  Alors les données parsées suivent l'encoding windows1252`, async () => {
  const data = readFileSync(`${__dirname}/fixtures/utf8.csv`);

  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(data);
      controller.close();
    },
  });

  const {
    parsedData: [actual],
  } = await parseCsv(readableStream, schema, {
    encoding: 'win1252',
  });

  const expected = {
    identifiantProjet: 'CRE4 - Autoconsommation mÃ©tropole#1##2',
    referenceDossier: 'RÃ©fdevis:',
    referenceDossierCorrigee: 'abcd',
  };

  expect(actual).to.deep.eq(expected);
});
