import { BeforeAll, Before, After } from '@cucumber/cucumber';
import { Unsubscribe } from '@potentiel/core-domain';
import { setupEventHandlers } from '@potentiel/domain';
import { subscribe } from '@potentiel/pg-event-sourcing';
import { executeQuery } from '@potentiel/pg-helpers';
import { createProjection, updateProjection } from '@potentiel/pg-projections';
import { should } from 'chai';

should();

let unsubscribes: Unsubscribe[] | undefined;

BeforeAll(() => {
  process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
});

Before(async () => {
  await executeQuery(`DELETE FROM "EVENT_STREAM"`);
  await executeQuery(`DELETE FROM "PROJECTION"`);

  unsubscribes = await setupEventHandlers({
    create: createProjection,
    subscribe,
    update: updateProjection,
  });
});

After(async () => {
  if (unsubscribes) {
    for (const unsubscribe of unsubscribes) {
      await unsubscribe();
    }
  }
  unsubscribes = undefined;
});
