import crypto from 'node:crypto';
import { after, before, describe, it } from 'node:test';

import { assert, expect } from 'chai';

import { killPool } from '@potentiel-libraries/pg-helpers';

import { download } from './download.js';
import { FichierInexistant } from './fichierInexistant.error.js';
import { upload } from './upload.js';

describe(`download file`, () => {
  before(() => {
    process.env.DATABASE_CONNECTION_STRING = 'postgres://potentiel@localhost:5433/potentiel';
  });

  after(async () => {
    await killPool();
  });

  it(`
    Etant donné un endpoint et un bucket
    Quand un fichier est téléversé
    Alors le fichier devrait être récupérable depuis le bucket`, async () => {
    const filePath = `path/to/${crypto.randomUUID()}.pdf`;
    const content = new ReadableStream({
      start: async (controller) => {
        controller.enqueue(Buffer.from(`Contenu d'un fichier`, 'utf-8'));
        controller.close();
      },
    });

    await upload(filePath, content);

    const actual = await download(filePath);
    expect(actual).not.to.be.null;
  });

  it(`
    Etant donné un endpoint et un bucket
    Quand aucun fichier n'est téléversé
    Alors le fichier ne devrait pas être récupérable depuis le bucket`, async () => {
    const filePath = `path/to/${crypto.randomUUID()}.pdf`;

    try {
      await download(filePath);
      assert.fail('should throw');
    } catch (e) {
      expect(e).to.be.instanceOf(FichierInexistant);
    }
  });
});
