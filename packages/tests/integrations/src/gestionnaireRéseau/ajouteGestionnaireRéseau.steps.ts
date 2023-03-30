import { should } from 'chai';
import { When as Quand, Then as Alors, BeforeAll, Before, After } from '@cucumber/cucumber';
import { Unsubscribe } from '@potentiel/core-domain';
import {
  ajouterGestionnaireRéseauCommandHandlerFactory,
  consulterGestionnaireRéseauQueryHandlerFactory,
  GestionnaireRéseauAjoutéEvent,
  gestionnaireRéseauAjoutéHandlerFactory,
} from '@potentiel/domain';
import { publish, loadAggregate, subscribe } from '@potentiel/pg-event-sourcing';
import { createProjection, findProjection } from '@potentiel/pg-projections';
import waitForExpect from 'wait-for-expect';
import { executeQuery } from '@potentiel/pg-helpers';

should();

let unsubscribe: Unsubscribe | undefined;

const codeEIC = '17X100A100A0001A';
const raisonSociale = 'Enedis';
const format = 'XX-YY-ZZ';
const légende = 'la légende';

BeforeAll(() => {
  process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
});

Before(async () => {
  await executeQuery(`DELETE FROM "EVENT_STREAM"`);
  await executeQuery(`DELETE FROM "PROJECTION"`);
});

After(async () => {
  if (unsubscribe) {
    await unsubscribe();
    unsubscribe = undefined;
  }
});

Quand('un administrateur ajoute un gestionnaire de réseau', async () => {
  const ajouterGestionnaireRéseau = ajouterGestionnaireRéseauCommandHandlerFactory({
    publish,
    loadAggregate,
  });

  const gestionnaireRéseauAjoutéHandler = gestionnaireRéseauAjoutéHandlerFactory({
    create: createProjection,
  });

  unsubscribe = await subscribe<GestionnaireRéseauAjoutéEvent>(
    'GestionnaireRéseauAjouté',
    gestionnaireRéseauAjoutéHandler,
  );

  await ajouterGestionnaireRéseau({
    codeEIC,
    raisonSociale,
    aideSaisieRéférenceDossierRaccordement: {
      format,
      légende,
    },
  });
});

Alors('le gestionnaire devrait être ajouté', async () => {
  const consulterGestionnaireRéseau = consulterGestionnaireRéseauQueryHandlerFactory({
    findGestionnaireRéseau: findProjection,
  });

  await waitForExpect(async () => {
    const actual = await consulterGestionnaireRéseau({ codeEIC });

    const expected: typeof actual = {
      type: 'gestionnaire-réseau',
      codeEIC,
      raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        format,
        légende,
      },
    };
    actual.should.be.deep.equal(expected);
  });
});
