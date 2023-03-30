import { should } from 'chai';
import {
  Given as EtantDonné,
  When as Quand,
  Then as Alors,
  BeforeAll,
  Before,
  After,
} from '@cucumber/cucumber';
import { Unsubscribe } from '@potentiel/core-domain';
import {
  consulterGestionnaireRéseauQueryHandlerFactory,
  createGestionnaireRéseauAggregateId,
  GestionnaireRéseauAjoutéEvent,
  gestionnaireRéseauAjoutéHandlerFactory,
  GestionnaireRéseauInconnuError,
  GestionnaireRéseauModifiéEvent,
  gestionnaireRéseauModifiéHandlerFactory,
  listerGestionnaireRéseauQueryHandlerFactory,
  modifierGestionnaireRéseauFactory,
} from '@potentiel/domain';
import { publish, loadAggregate, subscribe } from '@potentiel/pg-event-sourcing';
import {
  createProjection,
  findProjection,
  listProjection,
  updateProjection,
} from '@potentiel/pg-projections';
import waitForExpect from 'wait-for-expect';
import { executeQuery } from '@potentiel/pg-helpers';

should();

let unsubscribeAjouté: Unsubscribe | undefined;
let unsubscribeModifié: Unsubscribe | undefined;

const codeEIC = '17X100A100A0001A';
const raisonSociale = 'Enedis';
const format = 'XX-YY-ZZ';
const légende = 'la légende';

let error: Error | undefined;

BeforeAll(() => {
  process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
});

Before(async () => {
  await executeQuery(`DELETE FROM "EVENT_STREAM"`);
  await executeQuery(`DELETE FROM "PROJECTION"`);
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

EtantDonné('un gestionnaire de réseau', async function () {
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

  await publish(createGestionnaireRéseauAggregateId(codeEIC), {
    type: 'GestionnaireRéseauAjouté',
    payload: {
      codeEIC,
      raisonSociale,
    },
  });
});

Quand('un administrateur modifie les données du gestionnaire de réseau', async function () {
  const modifierGestionnaireRéseau = modifierGestionnaireRéseauFactory({
    publish,
    loadAggregate,
  });

  await modifierGestionnaireRéseau({
    codeEIC,
    raisonSociale: 'RTE',
    aideSaisieRéférenceDossierRaccordement: {
      format: 'AAA-BBB',
      légende: 'des lettres séparées par un tiret',
    },
  });
});

Quand(
  "un administrateur modifie la raison sociale d'un gestionnaire de réseau inconnu",
  async function () {
    const modifierGestionnaireRéseau = modifierGestionnaireRéseauFactory({
      publish,
      loadAggregate,
    });

    try {
      await modifierGestionnaireRéseau({
        codeEIC,
        raisonSociale: 'RTE',
        aideSaisieRéférenceDossierRaccordement: {
          format: 'AAA-BBB',
          légende: 'des lettres séparées par un tiret',
        },
      });
    } catch (error) {
      if (error instanceof GestionnaireRéseauInconnuError) {
        error = error;
      }
    }
  },
);

Alors('le gestionnaire de réseau devrait être mis à jour', async function () {
  const consulterGestionnaireRéseau = consulterGestionnaireRéseauQueryHandlerFactory({
    findGestionnaireRéseau: findProjection,
  });
  await waitForExpect(async () => {
    const actual = await consulterGestionnaireRéseau({ codeEIC });

    const expected: typeof actual = {
      type: 'gestionnaire-réseau',
      codeEIC,
      raisonSociale: 'RTE',
      aideSaisieRéférenceDossierRaccordement: {
        format: 'AAA-BBB',
        légende: 'des lettres séparées par un tiret',
      },
    };

    actual.should.be.deep.equal(expected);
  });

  const listerGestionnaireRéseau = listerGestionnaireRéseauQueryHandlerFactory({
    listGestionnaireRéseau: listProjection,
  });

  await waitForExpect(async () => {
    const actuals = await listerGestionnaireRéseau({});

    const expected: typeof actuals[number] = {
      type: 'gestionnaire-réseau',
      codeEIC,
      raisonSociale: 'RTE',
      aideSaisieRéférenceDossierRaccordement: {
        format: 'AAA-BBB',
        légende: 'des lettres séparées par un tiret',
      },
    };

    actuals.should.deep.contain(expected);
  });
});
