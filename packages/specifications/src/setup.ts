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

should();

setWorldConstructor(PotentielWorld);

let unsubscribes: Unsubscribe[] | undefined;

BeforeAll(() => {
  process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
});

BeforeStep(async () => {
  // As read data are inconsistant, we wait 100ms before each step.
  await sleep(100);
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
});

After(async () => {
  if (unsubscribes) {
    for (const unsubscribe of unsubscribes) {
      await unsubscribe();
    }
  }
  unsubscribes = undefined;
});
