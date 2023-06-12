import {
  Before,
  setWorldConstructor,
  BeforeStep,
  After,
  BeforeAll,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import { UnsetupDomain, setupDomain } from '@potentiel/domain';
import { loadAggregate, publish, subscribe } from '@potentiel/pg-event-sourcing';
import { executeQuery } from '@potentiel/pg-helpers';
import {
  createProjection,
  findProjection,
  listProjection,
  removeProjection,
  searchProjection,
  updateProjection,
} from '@potentiel/pg-projections';
import { should } from 'chai';
import { PotentielWorld } from './potentiel.world';
import { sleep } from './helpers/sleep';
import { getClient } from '@potentiel/file-storage';
import {
  téléchargerFichierDossierRaccordementAdapter,
  téléverserFichierDossierRaccordementAdapter,
} from '@potentiel/infra-adapters';
import { UnsetupDomainViews, setupDomainViews } from '@potentiel/domain-views';
import { clear } from 'mediateur';
import { legacyProjectRepository } from './helpers/legacy/legacyProjectRepository';

should();

setWorldConstructor(PotentielWorld);

setDefaultTimeout(5000);

const bucketName = 'potentiel';

let unsetupDomain: UnsetupDomain | undefined;
let unsetupDomainViews: UnsetupDomainViews | undefined;

BeforeStep(async () => {
  // As read data are inconsistant, we wait 100ms before each step.
  await sleep(1000);
});

BeforeAll(async () => {
  process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
  process.env.S3_ENDPOINT = 'http://localhost:9443/s3';
  process.env.S3_BUCKET = bucketName;
  process.env.AWS_ACCESS_KEY_ID = 'AKIAIOSFODNN7EXAMPLE';
  process.env.AWS_SECRET_ACCESS_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';
});

Before<PotentielWorld>(async function (this: PotentielWorld) {
  await getClient()
    .createBucket({
      Bucket: bucketName,
    })
    .promise();

  clear();

  unsetupDomain = setupDomain({
    common: {
      loadAggregate,
      publish,
      subscribe,
    },
    raccordement: {
      enregistrerAccuséRéceptionDemandeComplèteRaccordement:
        téléverserFichierDossierRaccordementAdapter,
      enregistrerPropositionTechniqueEtFinancièreSignée:
        téléverserFichierDossierRaccordementAdapter,
    },
  });

  unsetupDomainViews = setupDomainViews({
    common: {
      create: createProjection,
      find: findProjection,
      list: listProjection,
      remove: removeProjection,
      search: searchProjection,
      subscribe,
      update: updateProjection,
      legacy: {
        projectRepository: legacyProjectRepository,
      },
    },
    raccordement: {
      récupérerAccuséRéceptionDemandeComplèteRaccordement:
        téléchargerFichierDossierRaccordementAdapter,
      récupérerPropositionTechniqueEtFinancièreSignée: téléchargerFichierDossierRaccordementAdapter,
    },
  });

  await this.gestionnaireRéseauWorld.createEnedis();
});

After(async () => {
  await executeQuery(`DELETE FROM "EVENT_STREAM"`);
  await executeQuery(`DELETE FROM "PROJECTION"`);

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
