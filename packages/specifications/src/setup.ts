import { EventEmitter } from 'events';

import {
  Before,
  setWorldConstructor,
  After,
  BeforeAll,
  setDefaultTimeout,
  AfterAll,
  AfterStep,
} from '@cucumber/cucumber';
import { should } from 'chai';
import { clear } from 'mediateur';

import { executeQuery, killPool } from '@potentiel-libraries/pg-helpers';
import { bootstrap, logMiddleware } from '@potentiel-applications/bootstrap';
import { initLogger, resetLogger } from '@potentiel-libraries/monitoring';
import { createLogger } from '@potentiel-libraries/monitoring/winston';
import { startSubscribers } from '@potentiel-applications/subscribers';

import { waitForExpect } from '#helpers';

import { PotentielWorld } from './potentiel.world.js';
import { initialiserUtilisateursTests } from './utilisateur/stepDefinitions/utilisateur.given.js';
import { waitForSagasNotificationsAndProjectionsToFinish } from './helpers/waitForSagasNotificationsAndProjectionsToFinish.js';
import {
  createSendEmailTestAdapter,
  mockRécupererGarantiesFinancières,
  mockRécupérerGRDParVilleAdapter,
} from './_mocks/index.js';
import { resetBucket } from './helpers/resetBucket.js';

should();
setWorldConstructor(PotentielWorld);
setDefaultTimeout(5000);
waitForExpect.defaults.timeout = Number(process.env.WAIT_FOR_EXPECT_TIMEOUT_MS) || 300;

const bucketName = 'potentiel';

let unsetup: (() => Promise<void>) | undefined;

const disableNodeMaxListenerWarning = () => (EventEmitter.defaultMaxListeners = Infinity);

BeforeAll(async () => {
  process.env.DATABASE_CONNECTION_STRING = 'postgres://potentiel@localhost:5433/potentiel';
  process.env.S3_ENDPOINT = 'http://localhost:9001';
  process.env.S3_BUCKET = bucketName;
  process.env.AWS_REGION = 'localhost';
  process.env.AWS_ACCESS_KEY_ID = 'minioadmin';
  process.env.AWS_SECRET_ACCESS_KEY = 'minioadmin';
  process.env.BASE_URL = 'https://potentiel.beta.gouv.fr';
  process.env.TEAM_EMAIL = 'team@test.test';
  process.env.SEND_EMAILS_FROM = 'tests@test.test';
  process.env.SMTP_HOST = 'localhost';
  process.env.SMTP_PORT = '1026';

  disableNodeMaxListenerWarning();

  await resetBucket(bucketName);

  await executeQuery(
    'DROP RULE IF EXISTS prevent_delete_on_event_stream on event_store.event_stream',
  );
});

Before<PotentielWorld>(async function (this: PotentielWorld, { pickle }) {
  resetLogger();
  const logger = createLogger({
    defaultMeta: { test: pickle.name },
  });
  initLogger(logger);
  await executeQuery(`delete from event_store.pending_acknowledgement`);
  await executeQuery(`delete from event_store.event_stream`);
  await executeQuery(`delete from event_store.subscriber`);
  await executeQuery(`delete from domain_views.projection`);

  clear();

  const emailsAdapter = createSendEmailTestAdapter.bind(this)();

  await bootstrap({
    middlewares: [logMiddleware],
    dependencies: { sendEmail: emailsAdapter },
  });

  unsetup = await startSubscribers({
    dependencies: {
      récupérerGRDParVille: mockRécupérerGRDParVilleAdapter.bind(this),
      récupererConstitutionGarantiesFinancières: mockRécupererGarantiesFinancières.bind(this),
    },
  });

  await initialiserUtilisateursTests.call(this);
});

AfterStep(async function (this: PotentielWorld, { result, pickle, pickleStep }) {
  await waitForSagasNotificationsAndProjectionsToFinish();

  const expectsErrorOutcome = pickle.steps.find(
    (step) => step.type === 'Outcome' && step.text.includes('devrait être informé que'),
  );

  if (this.hasError && result.status === 'PASSED' && !expectsErrorOutcome) {
    throw this.error;
  }

  const lastContextStep = pickle.steps.filter((step) => step.type === 'Context').pop();
  if (pickleStep.id === lastContextStep?.id) {
    this.notificationWorld.resetNotifications();
  }
});

After(async function (this: PotentielWorld) {
  if (unsetup) {
    await unsetup();
  }
  unsetup = undefined;
});

AfterAll(async () => {
  await killPool();
});
