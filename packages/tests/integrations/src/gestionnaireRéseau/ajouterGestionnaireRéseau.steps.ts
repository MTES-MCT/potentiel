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
  ajouterGestionnaireRéseauCommandHandlerFactory,
  consulterGestionnaireRéseauQueryHandlerFactory,
  GestionnaireRéseauAjoutéEvent,
  gestionnaireRéseauAjoutéHandlerFactory,
  GestionnaireRéseauDéjàExistantError,
} from '@potentiel/domain';
import { publish, loadAggregate, subscribe } from '@potentiel/pg-event-sourcing';
import { createProjection, findProjection } from '@potentiel/pg-projections';
import waitForExpect from 'wait-for-expect';
import { executeQuery } from '@potentiel/pg-helpers';
import { AjouterGestionnaireRéseauWorld } from './ajouterGestionnaireRéseau.world';

should();

let unsubscribe: Unsubscribe | undefined;

const codeEIC = '17X100A100A0001A';
const raisonSociale = 'Enedis';
const format = 'XX-YY-ZZ';
const légende = 'la légende';

setWorldConstructor(AjouterGestionnaireRéseauWorld);

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

EtantDonné(
  'un gestionnaire de réseau avec un code EIC',
  async function (this: AjouterGestionnaireRéseauWorld) {
    await this.createGestionnaireRéseau(codeEIC, raisonSociale);
  },
);

Quand('un administrateur ajoute un gestionnaire de réseau', async function () {
  const gestionnaireRéseauAjoutéHandler = gestionnaireRéseauAjoutéHandlerFactory({
    create: createProjection,
  });

  unsubscribe = await subscribe<GestionnaireRéseauAjoutéEvent>(
    'GestionnaireRéseauAjouté',
    gestionnaireRéseauAjoutéHandler,
  );

  const ajouterGestionnaireRéseau = ajouterGestionnaireRéseauCommandHandlerFactory({
    publish,
    loadAggregate,
  });

  await ajouterGestionnaireRéseau({
    codeEIC,
    raisonSociale,
    aideSaisieRéférenceDossierRaccordement: {
      format,
      légende,
    },
  });
});

Quand(
  'un administrateur ajoute un gestionnaire de réseau ayant le même code EIC',
  async function (this: AjouterGestionnaireRéseauWorld) {
    const ajouterGestionnaireRéseau = ajouterGestionnaireRéseauCommandHandlerFactory({
      publish,
      loadAggregate,
    });

    try {
      await ajouterGestionnaireRéseau({
        codeEIC,
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement: {
          format,
          légende,
        },
      });
    } catch (err) {
      if (err instanceof GestionnaireRéseauDéjàExistantError) {
        this.error = err;
      }
    }
  },
);

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

Alors(
  /l'administrateur devrait être informé que "(.*)"/,
  function (this: AjouterGestionnaireRéseauWorld, message: string) {
    this.error?.message.should.be.equal(message);
  },
);
