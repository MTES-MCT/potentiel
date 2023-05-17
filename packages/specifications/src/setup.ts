import { BeforeAll, Before, After, setWorldConstructor, BeforeStep } from '@cucumber/cucumber';
import { Unsubscribe } from '@potentiel/core-domain';
import { setupEventHandlers } from '@potentiel/domain';
import { subscribe } from '@potentiel/pg-event-sourcing';
import { executeQuery } from '@potentiel/pg-helpers';
import {
  createProjection,
  findProjection,
  removeProjection,
  updateProjection,
} from '@potentiel/pg-projections';
import { should } from 'chai';
import { PotentielWorld } from './potentiel.world';
import { sleep } from './helpers/sleep';
import { getClient } from '@potentiel/file-storage';

should();

setWorldConstructor(PotentielWorld);

let unsubscribes: Unsubscribe[] | undefined;

const bucketName = 'potentiel';

BeforeAll(() => {
  process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  process.env.S3_ENDPOINT = 'http://localhost:9443/s3';
  process.env.S3_BUCKET = bucketName;
  process.env.AWS_ACCESS_KEY_ID = 'AKIAIOSFODNN7EXAMPLE';
  process.env.AWS_SECRET_ACCESS_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';
});

BeforeStep(async () => {
  // As read data are inconsistant, we wait 100ms before each step.
  await sleep(300);
});

Before<PotentielWorld>(async function (this: PotentielWorld) {
  await executeQuery(`DELETE FROM "EVENT_STREAM"`);
  await executeQuery(`DELETE FROM "PROJECTION"`);

  unsubscribes = await setupEventHandlers({
    create: createProjection,
    find: findProjection,
    subscribe,
    update: updateProjection,
    remove: removeProjection,
  });

  await this.gestionnaireRéseauWorld.createEnedis();

  const isBucketExists = async () => {
    try {
      await getClient()
        .headBucket({
          Bucket: bucketName,
        })
        .promise();
      return true;
    } catch (err) {
      return false;
    }
  };

  if (await isBucketExists()) {
    await getClient()
      .deleteBucket({
        Bucket: bucketName,
      })
      .promise();
  }

  await getClient()
    .createBucket({
      Bucket: bucketName,
    })
    .promise();
});

After(async () => {
  if (unsubscribes) {
    for (const unsubscribe of unsubscribes) {
      await unsubscribe();
    }
  }
  unsubscribes = undefined;
});
