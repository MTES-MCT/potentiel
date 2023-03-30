import {
  Given as EtantDonné,
  When as Quand,
  Then as Alors,
  setWorldConstructor,
} from '@cucumber/cucumber';
import {
  ajouterGestionnaireRéseauCommandHandlerFactory,
  consulterGestionnaireRéseauQueryHandlerFactory,
  GestionnaireRéseauDéjàExistantError,
  GestionnaireRéseauReadModel,
  listerGestionnaireRéseauQueryHandlerFactory,
} from '@potentiel/domain';
import { publish, loadAggregate } from '@potentiel/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel/pg-projections';
import waitForExpect from 'wait-for-expect';
import { AjouterGestionnaireRéseauWorld } from './ajouterGestionnaireRéseau.world';

const codeEIC = '17X100A100A0001A';
const raisonSociale = 'Enedis';
const format = 'XX-YY-ZZ';
const légende = 'la légende';

setWorldConstructor(AjouterGestionnaireRéseauWorld);

EtantDonné(
  'un gestionnaire de réseau avec un code EIC',
  async function (this: AjouterGestionnaireRéseauWorld) {
    await this.createGestionnaireRéseau(codeEIC, raisonSociale);
  },
);

Quand('un administrateur ajoute un gestionnaire de réseau', async function () {
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

  const consulterGestionnaireRéseau = consulterGestionnaireRéseauQueryHandlerFactory({
    findGestionnaireRéseau: findProjection,
  });

  const listerGestionnaireRéseau = listerGestionnaireRéseauQueryHandlerFactory({
    listGestionnaireRéseau: listProjection,
  });

  waitForExpect(async () => {
    this.actual = await consulterGestionnaireRéseau({ codeEIC });
    this.actualList = await listerGestionnaireRéseau({});
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

Alors('le gestionnaire devrait être ajouté', async function (this: AjouterGestionnaireRéseauWorld) {
  const expected: GestionnaireRéseauReadModel = {
    type: 'gestionnaire-réseau',
    codeEIC,
    raisonSociale,
    aideSaisieRéférenceDossierRaccordement: {
      format,
      légende,
    },
  };
  this.actual?.should.be.deep.equal(expected);

  this.actualList?.should.deep.contain(expected);
});

Alors(
  /l'administrateur devrait être informé que "(.*)"/,
  function (this: AjouterGestionnaireRéseauWorld, message: string) {
    this.error?.message.should.be.equal(message);
  },
);
