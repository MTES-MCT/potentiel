import { Readable } from 'node:stream';
import { before, beforeEach, describe, it } from 'node:test';

import { expect } from 'chai';

import { copyFile } from './copyFile.js';
import { download } from './download.js';
import { createOrRecreateBucket, setTestBucketEnvVariable } from './test-utils.integration.js';
import { upload } from './upload.js';

describe(`copy file`, () => {
  const bucketName = 'potentiel';
  before(() => {
    setTestBucketEnvVariable(bucketName);
  });

  beforeEach(async () => {
    await createOrRecreateBucket(bucketName);
  });

  it(`
    Etant donné un endpoint et un bucket
    Et un fichier téléverśe
    Quand un fichier est copié
    Alors la copie devrait être récupérable depuis le bucket`, async () => {
    const sourcePath = 'path/to/file.pdf';
    const targetPath = 'path/to/another/file.pdf';

    const content = Readable.toWeb(Readable.from(`Contenu d'un fichier`));

    await upload(sourcePath, content);
    await copyFile(sourcePath, targetPath);

    const actual = await download(targetPath);
    expect(actual).not.to.be.null;
  });
});
