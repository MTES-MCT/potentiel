import {
  Before,
  setWorldConstructor,
  BeforeStep,
  After,
  BeforeAll,
  setDefaultTimeout,
  AfterAll,
} from '@cucumber/cucumber';
import { executeQuery, killPool } from '@potentiel/pg-helpers';
import { should } from 'chai';
import { PotentielWorld } from './potentiel.world';
import { sleep } from './helpers/sleep';
import { getClient } from '@potentiel/file-storage';
import { clear } from 'mediateur';
import { disconnectRedis } from '@potentiel/redis-event-bus-consumer';
import { setupDomain, UnsetupDomain } from '@potentiel/domain';
import { setupDomainViews, UnsetupDomainViews } from '@potentiel/domain-views';
import {
  téléverserFichierDossierRaccordementAdapter,
  téléchargerFichierDossierRaccordementAdapter,
  récupérerDétailProjetAdapter,
} from '@potentiel/infra-adapters';
import { loadAggregate, oldSubscribe, publish } from '@potentiel/pg-event-sourcing';
import {
  createProjection,
  findProjection,
  listProjection,
  removeProjection,
  searchProjection,
  updateProjection,
} from '@potentiel/pg-projections';

should();

setWorldConstructor(PotentielWorld);

setDefaultTimeout(5000);

const bucketName = 'potentiel';

let unsetupDomain: UnsetupDomain | undefined;
let unsetupDomainViews: UnsetupDomainViews | undefined;

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
});

Before<PotentielWorld>(async function (this: PotentielWorld) {
  await getClient()
    .createBucket({
      Bucket: bucketName,
    })
    .promise();

  clear();

  await executeQuery(`insert into event_store.subscriber values($1)`, 'new_event');

  unsetupDomain = await setupDomain({
    common: {
      loadAggregate,
      publish,
      subscribe: oldSubscribe,
    },
    raccordement: {
      enregistrerAccuséRéceptionDemandeComplèteRaccordement:
        téléverserFichierDossierRaccordementAdapter,
      enregistrerPropositionTechniqueEtFinancièreSignée:
        téléverserFichierDossierRaccordementAdapter,
    },
  });

  unsetupDomainViews = await setupDomainViews({
    common: {
      create: createProjection,
      find: findProjection,
      list: listProjection,
      remove: removeProjection,
      search: searchProjection,
      subscribe: oldSubscribe,
      update: updateProjection,
    },
    appelOffre: {},
    projet: {
      récupérerDétailProjet: récupérerDétailProjetAdapter,
    },
    raccordement: {
      récupérerAccuséRéceptionDemandeComplèteRaccordement:
        téléchargerFichierDossierRaccordementAdapter,
      récupérerPropositionTechniqueEtFinancièreSignée: téléchargerFichierDossierRaccordementAdapter,
    },
  });
});

After(async () => {
  await executeQuery(`delete from "projects"`);
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

  if (unsetupDomain) {
    await unsetupDomain();
  }
  unsetupDomain = undefined;

  if (unsetupDomainViews) {
    await unsetupDomainViews();
  }
  unsetupDomainViews = undefined;
});

AfterAll(async () => {
  await killPool();
  disconnectRedis();
});
