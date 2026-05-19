import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';

import { expect } from 'chai';

import { killPool } from '@potentiel-libraries/pg-helpers';

import { copyFile } from './copyFile.js';
import { download } from './download.js';
import { upload } from './upload.js';

describe(`copy file`, () => {
  before(() => {
    process.env.DATABASE_CONNECTION_STRING = 'postgres://potentiel@localhost:5433/potentiel';
  });

  after(async () => {
    await killPool();
  });

  it(`
    Etant donné un fichier téléverśe
    Quand un fichier est copié
    Alors la copie devrait être récupérable depuis le bucket`, async () => {
    const uid = crypto.randomUUID();
    const sourcePath = `${uid}/to/file.pdf`;
    const targetPath = `${uid}/to/another/file.pdf`;

    const content = new ReadableStream({
      start: async (controller) => {
        controller.enqueue(Buffer.from(`Contenu d'un fichier`, 'utf-8'));
        controller.close();
      },
    });

    await upload(sourcePath, content);
    await copyFile(sourcePath, targetPath);

    const actual = await download(targetPath);
    expect(actual).not.to.be.null;
  });

  it(`
    Quand un fichier inexistant est copié
    Alors une erreur est émise`, async () => {
    const uid = crypto.randomUUID();
    const sourcePath = `${uid}/to/file.pdf`;
    const targetPath = `${uid}/to/another/file.pdf`;

    await assert.rejects(
      () => copyFile(sourcePath, targetPath),
      'La copie du fichier a échoué : fichier non trouvé',
    );
  });
});
