import { EventEmitter } from 'events';

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
  ListObjectsCommand,
} from '@aws-sdk/client-s3';

import { executeQuery, killPool } from '@potentiel-libraries/pg-helpers';
import { getClient } from '@potentiel-libraries/file-storage';
import { bootstrap } from '@potentiel-applications/bootstrap';
// eslint-disable-next-line no-restricted-imports
import { SendEmailCommand } from '@potentiel-applications/notifications/src/register';

import { PotentielWorld } from './potentiel.world';
import { sleep } from './helpers/sleep';

should();

setWorldConstructor(PotentielWorld);

setDefaultTimeout(5000);

const bucketName = 'potentiel';

let unsetup: (() => Promise<void>) | undefined;

const disableNodeMaxListenerWarning = () => (EventEmitter.defaultMaxListeners = Infinity);

BeforeStep(async ({ pickleStep }) => {
  // As read data are inconsistant, we wait 100ms before each step.
  if (pickleStep.type !== 'Context') {
    // As read data are inconsistant, we wait 100ms before each step.
    await sleep(200);
  }
});

AfterStep(async function (this: PotentielWorld, { pickleStep, result }) {
  if (pickleStep.type === 'Outcome' && result.status === 'PASSED') {
    if (!pickleStep.text.includes('devrait être informé que')) {
      expect(this.hasNoError).to.be.true;
    }
  }
});

BeforeAll(async () => {
  process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  process.env.S3_ENDPOINT = 'http://localhost:9001';
  process.env.S3_BUCKET = bucketName;
  process.env.AWS_REGION = 'localhost';
  process.env.AWS_ACCESS_KEY_ID = 'minioadmin';
  process.env.AWS_SECRET_ACCESS_KEY = 'minioadmin';

  disableNodeMaxListenerWarning();

  await executeQuery(
    'DROP RULE IF EXISTS prevent_delete_on_event_stream on event_store.event_stream',
  );
});

Before<PotentielWorld>(async function (this: PotentielWorld) {
  await executeQuery(`delete from "projects"`);
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

  unsetup = await bootstrap({ middlewares: [testEmailMiddleware.bind(this)] });
});

After(async () => {
  const objectsToDelete = await getClient().send(new ListObjectsCommand({ Bucket: bucketName }));

  if (objectsToDelete.Contents?.length) {
    await getClient().send(
      new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: { Objects: objectsToDelete.Contents.map((o) => ({ Key: o.Key! })) },
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

const isSendEmailCommand = (message: Message): message is SendEmailCommand => {
  return (message as SendEmailCommand).type === 'System.Notification.Email.Send';
};

async function testEmailMiddleware(
  this: PotentielWorld,
  message: Message,
  next: () => Promise<MessageResult<Message>>,
): Promise<MessageResult<Message>> {
  if (isSendEmailCommand(message)) {
    this.notificationWorld.ajouterNotification(message.data);
    return;
  }
  return next();
}
