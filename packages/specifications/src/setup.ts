import { EventEmitter } from 'events';

import { faker } from '@faker-js/faker';
import {
  Before,
  setWorldConstructor,
  BeforeStep,
  After,
  BeforeAll,
  setDefaultTimeout,
  AfterAll,
  AfterStep,
} from '@cucumber/cucumber';
import { should } from 'chai';
import { clear } from 'mediateur';
import {
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import waitForExpect from 'wait-for-expect';

import { executeQuery, killPool } from '@potentiel-libraries/pg-helpers';
import { getClient } from '@potentiel-libraries/file-storage';
import { bootstrap, logMiddleware } from '@potentiel-applications/bootstrap';
import { createLogger, initLogger, resetLogger } from '@potentiel-libraries/monitoring';
import { startSubscribers } from '@potentiel-applications/subscribers';

import { PotentielWorld } from './potentiel.world';
import { sleep } from './helpers/sleep';
import { getFakeFormat } from './helpers/getFakeFormat';
import { getFakeIdentifiantProjet } from './helpers/getFakeIdentifiantProjet';
import { getFakeContent, getFakeDocument } from './helpers/getFakeContent';
import { initialiserUtilisateursTests } from './utilisateur/stepDefinitions/utilisateur.given';
import { waitForSagasNotificationsAndProjectionsToFinish } from './helpers/waitForSagasNotificationsAndProjectionsToFinish';
import { createS3ClientWithMD5 } from './helpers/createS3ClientWithMD5';
import { TestTransport } from './test-transport.logger';
import {
  mockRécupererGarantiesFinancières,
  mockRécupérerGRDParVilleAdapter,
  mockEmailAdapter,
} from './_mocks';

should();
setWorldConstructor(PotentielWorld);
setDefaultTimeout(5000);
waitForExpect.defaults.timeout = 300;

declare module '@faker-js/faker' {
  interface Faker {
    potentiel: {
      identifiantProjet: typeof getFakeIdentifiantProjet;
      fileFormat: () => string;
      fileContent: () => ReadableStream;
      document: () => { format: string; content: string };
    };
  }
}

faker.potentiel = {
  fileFormat: getFakeFormat,
  identifiantProjet: getFakeIdentifiantProjet,
  fileContent: getFakeContent,
  document: getFakeDocument,
};

const bucketName = 'potentiel';

let unsetup: (() => Promise<void>) | undefined;
const testLoggerTransport = new TestTransport();
const disableNodeMaxListenerWarning = () => (EventEmitter.defaultMaxListeners = Infinity);

BeforeStep(async ({ pickleStep }) => {
  // As read data are inconsistant, we wait 100ms before each step.
  if (pickleStep.type !== 'Context') {
    // As read data are inconsistant, we wait 100ms before each step.
    await sleep(100);
  }
});

AfterStep(async function (this: PotentielWorld, { result, pickle }) {
  await waitForSagasNotificationsAndProjectionsToFinish();

  const expectsErrorOutcome = pickle.steps.find(
    (step) => step.type === 'Outcome' && step.text.includes('devrait être informé que'),
  );

  if (this.hasError && result.status === 'PASSED' && !expectsErrorOutcome) {
    throw this.error;
  }
});

BeforeAll(async () => {
  process.env.DATABASE_CONNECTION_STRING = 'postgres://potentiel@localhost:5433/potentiel';
  process.env.S3_ENDPOINT = 'http://localhost:9001';
  process.env.S3_BUCKET = bucketName;
  process.env.AWS_REGION = 'localhost';
  process.env.AWS_ACCESS_KEY_ID = 'minioadmin';
  process.env.AWS_SECRET_ACCESS_KEY = 'minioadmin';
  process.env.BASE_URL = 'https://potentiel.beta.gouv.fr';
  process.env.FEATURES = 'délai';

  disableNodeMaxListenerWarning();

  await executeQuery(
    'DROP RULE IF EXISTS prevent_delete_on_event_stream on event_store.event_stream',
  );
});

Before<PotentielWorld>(async function (this: PotentielWorld, { pickle }) {
  resetLogger();
  testLoggerTransport.clear();
  const logger = createLogger({
    defaultMeta: { test: pickle.name },
  });
  initLogger(logger);
  await executeQuery(`delete from "projects"`);
  await executeQuery(`delete from event_store.pending_acknowledgement`);
  await executeQuery(`delete from event_store.event_stream`);
  await executeQuery(`delete from event_store.subscriber`);
  await executeQuery(`delete from domain_views.projection`);
  await executeQuery(`delete from "userDreals"`);
  await executeQuery(`delete from "UserProjects"`);
  await executeQuery(`delete from "users"`);

  await getClient().send(
    new CreateBucketCommand({
      Bucket: bucketName,
    }),
  );

  clear();

  await bootstrap({
    middlewares: [logMiddleware],
  });

  unsetup = await startSubscribers({
    dependencies: {
      sendEmail: mockEmailAdapter.bind(this),
      récupérerGRDParVille: mockRécupérerGRDParVilleAdapter.bind(this),
      récupererConstitutionGarantiesFinancières: mockRécupererGarantiesFinancières.bind(this),
    },
  });

  await initialiserUtilisateursTests.call(this);
});

After(async ({ result }) => {
  const objectsToDelete = await getClient().send(new ListObjectsV2Command({ Bucket: bucketName }));

  if (objectsToDelete.Contents?.length) {
    await createS3ClientWithMD5().send(
      new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: { Objects: objectsToDelete.Contents.map((o) => ({ Key: o.Key })) },
      }),
    );
  }

  await getClient().send(
    new DeleteBucketCommand({
      Bucket: bucketName,
    }),
  );

  if (unsetup) {
    await unsetup();
  }
  unsetup = undefined;

  if (result?.status === 'FAILED') {
    console.log('----- BEGIN TEST LOG OUTPUT -----');
    testLoggerTransport.dumpToConsole();
    console.log('----- END TEST LOG OUTPUT -----');
  }
});

AfterAll(async () => {
  await killPool();
});
