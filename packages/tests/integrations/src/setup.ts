import { BeforeAll, Before, After } from '@cucumber/cucumber';
import { Unsubscribe } from '@potentiel/core-domain';
import {
  gestionnaireRéseauAjoutéHandlerFactory,
  GestionnaireRéseauAjoutéEvent,
  gestionnaireRéseauModifiéHandlerFactory,
  GestionnaireRéseauModifiéEvent,
} from '@potentiel/domain';
import { subscribe } from '@potentiel/pg-event-sourcing';
import { executeQuery } from '@potentiel/pg-helpers';
import { createProjection, updateProjection } from '@potentiel/pg-projections';

let unsubscribeAjouté: Unsubscribe | undefined;
let unsubscribeModifié: Unsubscribe | undefined;

BeforeAll(() => {
  process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
});

Before(async () => {
  await executeQuery(`DELETE FROM "EVENT_STREAM"`);
  await executeQuery(`DELETE FROM "PROJECTION"`);

  const gestionnaireRéseauAjoutéHandler = gestionnaireRéseauAjoutéHandlerFactory({
    create: createProjection,
  });

  unsubscribeAjouté = await subscribe<GestionnaireRéseauAjoutéEvent>(
    'GestionnaireRéseauAjouté',
    gestionnaireRéseauAjoutéHandler,
  );

  const gestionnaireRéseauModifiéHandler = gestionnaireRéseauModifiéHandlerFactory({
    update: updateProjection,
  });

  unsubscribeModifié = await subscribe<GestionnaireRéseauModifiéEvent>(
    'GestionnaireRéseauModifié',
    gestionnaireRéseauModifiéHandler,
  );
});

After(async () => {
  if (unsubscribeAjouté) {
    await unsubscribeAjouté();
    unsubscribeAjouté = undefined;
  }

  if (unsubscribeModifié) {
    await unsubscribeModifié();
    unsubscribeModifié = undefined;
  }
});
