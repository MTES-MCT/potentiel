import crypto from 'node:crypto';
import { after, before, describe, it } from 'node:test';

import { expect } from 'chai';

import { killPool } from '@potentiel-libraries/pg-helpers';

import { download } from './download.js';
import { upload } from './upload.js';

describe(`upload file`, () => {
  before(() => {
    process.env.DATABASE_CONNECTION_STRING = 'postgres://potentiel@localhost:5433/potentiel';
  });

  after(async () => {
    await killPool();
  });

  it(`
    Etant donné un endpoint et un bucket
    Quand un fichier est téléversé
    Alors il devrait être récupérable depuis le bucket`, async () => {
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
    const actualContent = await convertReadableStreamToString(actual);
    expect(actualContent).to.equal(`Contenu d'un fichier`);
  });
});

export const convertReadableStreamToString = async (readable: ReadableStream) => {
  const reader = readable.getReader();

  const chunks: Buffer[] = [];

  const readFile = async (): Promise<void> => {
    const result = await reader.read();
    if (result.done) {
      reader.releaseLock();
    } else {
      chunks.push(Buffer.from(result.value));
      return await readFile();
    }
  };
  await readFile();

  return Buffer.concat(chunks).toString('utf-8');
};
