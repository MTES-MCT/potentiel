import {
  Before,
  setWorldConstructor,
  BeforeStep,
  After,
  BeforeAll,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import { bootstrap, UnsetupApp } from '@potentiel/web';
import { executeQuery } from '@potentiel/pg-helpers';
import { should } from 'chai';
import { PotentielWorld } from './potentiel.world';
import { sleep } from './helpers/sleep';
import { getClient } from '@potentiel/file-storage';
import { clear } from 'mediateur';
import { legacyProjectRepository } from './helpers/legacy/legacyProjectRepository';

should();

setWorldConstructor(PotentielWorld);

setDefaultTimeout(5000);

const bucketName = 'potentiel';

let unsetupApp: UnsetupApp | undefined;

BeforeStep(async () => {
  // As read data are inconsistant, we wait 100ms before each step.
  await sleep(200);
});

BeforeAll(async () => {
  process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  process.env.S3_ENDPOINT = 'http://localhost:9001';
  process.env.S3_BUCKET = bucketName;
  process.env.AWS_ACCESS_KEY_ID = 'minioadmin';
  process.env.AWS_SECRET_ACCESS_KEY = 'minioadmin';
  process.env.REDIS_EVENT_BUS_STREAM_NAME = 'potentiel-eventbus-local';
  process.env.REDIS_URL = 'redis://localhost:6380';
});

Before<PotentielWorld>(async function (this: PotentielWorld) {
  await getClient()
    .createBucket({
      Bucket: bucketName,
    })
    .promise();

  clear();

  unsetupApp = await bootstrap({
    projectRepository: legacyProjectRepository,
  });
});

After(async () => {
  await executeQuery(`DELETE FROM "EVENT_STREAM"`);
  await executeQuery(`DELETE FROM "PROJECTION"`);

  const objectsToDelete = await getClient().listObjects({ Bucket: bucketName }).promise();

  if (objectsToDelete.Contents?.length) {
    await getClient()
      .deleteObjects({
        Bucket: bucketName,
        Delete: { Objects: objectsToDelete.Contents.map((o) => ({ Key: o.Key! })) },
      })
      .promise();
  }

  await getClient()
    .deleteBucket({
      Bucket: bucketName,
    })
    .promise();

  if (unsetupApp) {
    await unsetupApp();
  }
  unsetupApp = undefined;
});
