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
import { expect, should } from 'chai';
import { Message, MessageResult, clear } from 'mediateur';
import {
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';

import { executeQuery, killPool } from '@potentiel-libraries/pg-helpers';
import { getClient } from '@potentiel-libraries/file-storage';
import { bootstrap } from '@potentiel-applications/bootstrap';
import { EmailPayload } from '@potentiel-applications/notifications';
import { Option } from '@potentiel-libraries/monads';
import { createLogger, initLogger } from '@potentiel-libraries/monitoring';

import { PotentielWorld } from './potentiel.world';
import { sleep } from './helpers/sleep';
import { getFakeFormat } from './helpers/getFakeFormat';
import { getFakeIdentifiantProjet } from './helpers/getFakeIdentifiantProjet';
import { getFakeContent } from './helpers/getFakeContent';
import { initialiserUtilisateursTests } from './utilisateur/stepDefinitions/utilisateur.given';
import { waitForSagasNotificationsAndProjectionsToFinish } from './helpers/waitForSagasNotificationsAndProjectionsToFinish';

should();
setWorldConstructor(PotentielWorld);
setDefaultTimeout(5000);

declare module '@faker-js/faker' {
  interface Faker {
    potentiel: {
      identifiantProjet: typeof getFakeIdentifiantProjet;
      fileFormat: () => string;
      fileContent: () => ReadableStream;
    };
  }
}

faker.potentiel = {
  fileFormat: getFakeFormat,
  identifiantProjet: getFakeIdentifiantProjet,
  fileContent: getFakeContent,
};

const bucketName = 'potentiel';

let unsetup: (() => Promise<void>) | undefined;

const disableNodeMaxListenerWarning = () => (EventEmitter.defaultMaxListeners = Infinity);

BeforeStep(async ({ pickleStep }) => {
  // As read data are inconsistant, we wait 100ms before each step.
  if (pickleStep.type !== 'Context') {
    // As read data are inconsistant, we wait 100ms before each step.
    await sleep(100);
  }
});

AfterStep(async function (this: PotentielWorld, { pickleStep, result }) {
  if (pickleStep.type && ['Context', 'Action'].includes(pickleStep.type)) {
    await waitForSagasNotificationsAndProjectionsToFinish();
  }

  if (pickleStep.type === 'Outcome' && result.status === 'PASSED') {
    if (!pickleStep.text.includes('devrait être informé que')) {
      expect(this.hasNoError).to.be.true;
    }
  }
});

BeforeAll(async () => {
  const logger = createLogger({});
  initLogger(logger);
  process.env.DATABASE_CONNECTION_STRING = 'postgres://potentiel@localhost:5433/potentiel';
  process.env.S3_ENDPOINT = 'http://localhost:9001';
  process.env.S3_BUCKET = bucketName;
  process.env.AWS_REGION = 'localhost';
  process.env.AWS_ACCESS_KEY_ID = 'minioadmin';
  process.env.AWS_SECRET_ACCESS_KEY = 'minioadmin';
  process.env.BASE_URL = 'https://potentiel.beta.gouv.fr';

  disableNodeMaxListenerWarning();

  await executeQuery(
    'DROP RULE IF EXISTS prevent_delete_on_event_stream on event_store.event_stream',
  );
});

Before<PotentielWorld>(async function (this: PotentielWorld) {
  await executeQuery(`delete from "projects"`);
  await executeQuery(`delete from event_store.pending_acknowledgement`);
  await executeQuery(`delete from event_store.event_stream`);
  await executeQuery(`delete from event_store.subscriber`);
  await executeQuery(`delete from domain_views.projection`);
  await executeQuery(`delete from "userDreals"`);
  await executeQuery(`delete from "UserProjects"`);
  await executeQuery(`delete from "users"`);

  await initialiserUtilisateursTests.call(this);

  await getClient().send(
    new CreateBucketCommand({
      Bucket: bucketName,
    }),
  );

  clear();

  unsetup = await bootstrap({
    middlewares: [],
    dependencies: {
      sendEmail: testEmailAdapter.bind(this),
      récupérerGRDParVille: mockRécupérerGRDParVilleAdapter.bind(this),
    },
  });
});

After(async () => {
  const objectsToDelete = await getClient().send(new ListObjectsV2Command({ Bucket: bucketName }));

  if (objectsToDelete.Contents?.length) {
    await getClient().send(
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
});

AfterAll(async () => {
  await killPool();
});

async function testEmailAdapter(
  this: PotentielWorld,
  emailPayload: EmailPayload,
): Promise<MessageResult<Message>> {
  this.notificationWorld.ajouterNotification(emailPayload);
}

async function mockRécupérerGRDParVilleAdapter(
  this: PotentielWorld,
  search: { codePostal: string; commune: string },
) {
  return this.gestionnaireRéseauWorld.rechercherOREParVille(search) ?? Option.none;
}
