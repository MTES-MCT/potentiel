import {
  Before,
  setWorldConstructor,
  BeforeStep,
  After,
  BeforeAll,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import { executeQuery } from '@potentiel/pg-helpers';
import { should } from 'chai';
import { PotentielWorld } from './potentiel.world';
import { sleep } from './helpers/sleep';
import { getClient } from '@potentiel/file-storage';
import { bootstrap, UnsetupApp } from '@potentiel/web';
import { clear } from 'mediateur';

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
  process.env.LOGGER_LEVEL = 'debug';
});

Before<PotentielWorld>(async function (this: PotentielWorld) {
  await getClient()
    .createBucket({
      Bucket: bucketName,
    })
    .promise();

  clear();

  await executeQuery(`insert into event_store.subscriber values($1)`, 'new_event');

  unsetupApp = await bootstrap({
    projectRepository: { findOne: async () => ({} as any) }, // TODO : Cette dependance ne devrait pas être là
  });
});

After(async () => {
  await executeQuery(`delete from event_store.event_stream`);
  await executeQuery(`delete from event_store.subscriber`);
  await executeQuery(`delete from domain_views.projection`);

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
});
