import { Before, setWorldConstructor, BeforeStep, After, BeforeAll } from '@cucumber/cucumber';
import { setupDomain, UnsetupDomain } from '@potentiel/domain';
import { loadAggregate, publish, subscribe } from '@potentiel/pg-event-sourcing';
import { executeQuery } from '@potentiel/pg-helpers';
import {
  createProjection,
  findProjection,
  listProjection,
  removeProjection,
  updateProjection,
} from '@potentiel/pg-projections';
import { should } from 'chai';
import { PotentielWorld } from './potentiel.world';
import { sleep } from './helpers/sleep';
import { getClient } from '@potentiel/file-storage';
import {
  téléverserAccuséRéceptionDemandeComplèteRaccordementAdapter,
  téléverserPropositionTechniqueEtFinancièreSignéeAdapter,
  supprimerAccuséRéceptionDemandeComplèteRaccordementAdapter,
  supprimerPropositionTechniqueEtFinancièreSignéeAdapter,
  téléchargerAccuséRéceptionDemandeComplèteRaccordementAdapter,
  téléchargerPropositionTechniqueEtFinancièreSignéeAdapter,
} from '@potentiel/infra-adapters';

should();

setWorldConstructor(PotentielWorld);

const bucketName = 'potentiel';

let unsetupDomain: UnsetupDomain | undefined;

BeforeStep(async () => {
  // As read data are inconsistant, we wait 100ms before each step.
  await sleep(500);
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

  unsetupDomain = setupDomain({
    command: {
      loadAggregate,
      publish,
    },
    query: {
      find: findProjection,
      list: listProjection,
    },
    event: {
      create: createProjection,
      remove: removeProjection,
      update: updateProjection,
    },
    raccordement: {
      enregistrerAccuséRéceptionDemandeComplèteRaccordement:
        téléverserAccuséRéceptionDemandeComplèteRaccordementAdapter,
      enregistrerPropositionTechniqueEtFinancièreSignée:
        téléverserPropositionTechniqueEtFinancièreSignéeAdapter,
      récupérerAccuséRéceptionDemandeComplèteRaccordement:
        téléchargerAccuséRéceptionDemandeComplèteRaccordementAdapter,
      récupérerPropositionTechniqueEtFinancièreSignée:
        téléchargerPropositionTechniqueEtFinancièreSignéeAdapter,
      supprimerAccuséRéceptionDemandeComplèteRaccordement:
        supprimerAccuséRéceptionDemandeComplèteRaccordementAdapter,
      supprimerPropositionTechniqueEtFinancièreSignée:
        supprimerPropositionTechniqueEtFinancièreSignéeAdapter,
    },
    subscribe,
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
});
