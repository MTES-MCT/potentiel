import crypto from 'node:crypto';
import { after, before, describe, it } from 'node:test';

import { expect } from 'chai';

import { killPool } from '@potentiel-libraries/pg-helpers';

import { fileExists } from './fileExists.js';
import { upload } from './upload.js';

describe(fileExists.name, () => {
  before(() => {
    process.env.DATABASE_CONNECTION_STRING = 'postgres://potentiel@localhost:5433/potentiel';
  });

  after(async () => {
    await killPool();
  });

  it(`Quand un fichier est téléversé
    Alors le fichier devrait exister`, async () => {
    const filePath = `path/to/${crypto.randomUUID()}.pdf`;
    const content = new ReadableStream({
      start: async (controller) => {
        controller.enqueue(Buffer.from(`Contenu d'un fichier`, 'utf-8'));
        controller.close();
      },
    });

    await upload(filePath, content);

    const actual = await fileExists(filePath);
    expect(actual).to.eq(true);
  });

  it(`Quand aucun fichier n'est téléversé
    Alors le fichier ne devrait pas exister`, async () => {
    const filePath = `path/to/${crypto.randomUUID()}.pdf`;

    const actual = await fileExists(filePath);
    expect(actual).to.eq(false);
  });
});
