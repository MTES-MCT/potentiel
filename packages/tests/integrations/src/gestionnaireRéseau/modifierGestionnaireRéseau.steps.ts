import { should } from 'chai';
import {
  Given as EtantDonné,
  When as Quand,
  Then as Alors,
  BeforeAll,
  Before,
  After,
  setWorldConstructor,
} from '@cucumber/cucumber';
import { Unsubscribe } from '@potentiel/core-domain';
import {
  consulterGestionnaireRéseauQueryHandlerFactory,
  GestionnaireRéseauAjoutéEvent,
  gestionnaireRéseauAjoutéHandlerFactory,
  GestionnaireRéseauInconnuError,
  GestionnaireRéseauModifiéEvent,
  gestionnaireRéseauModifiéHandlerFactory,
  listerGestionnaireRéseauQueryHandlerFactory,
  modifierGestionnaireRéseauFactory,
} from '@potentiel/domain';
import { loadAggregate, publish, subscribe } from '@potentiel/pg-event-sourcing';
import {
  createProjection,
  findProjection,
  listProjection,
  updateProjection,
} from '@potentiel/pg-projections';
import waitForExpect from 'wait-for-expect';
import { executeQuery } from '@potentiel/pg-helpers';
import { ModifierGestionnaireRéseauWorld } from './modifierGestionnaireRéseau.world';

// Global
should();

let unsubscribeAjouté: Unsubscribe | undefined;
let unsubscribeModifié: Unsubscribe | undefined;

// Example
const codeEIC = '17X100A100A0001A';

setWorldConstructor(ModifierGestionnaireRéseauWorld);

// Global
BeforeAll(() => {
  process.env.EVENT_STORE_CONNECTION_STRING = 'postgres://testuser@localhost:5433/potentiel_test';
});

// Global
Before(async () => {
  await executeQuery(`DELETE FROM "EVENT_STREAM"`);
  await executeQuery(`DELETE FROM "PROJECTION"`);
});

// Global
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

EtantDonné('un gestionnaire de réseau', async function (this: ModifierGestionnaireRéseauWorld) {
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

  await this.createGestionnaireRéseau(codeEIC, 'ENEDIS');
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
  async function (this: ModifierGestionnaireRéseauWorld) {
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
        this.error = error;
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
