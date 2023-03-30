import {
  Given as EtantDonné,
  When as Quand,
  Then as Alors,
  setWorldConstructor,
} from '@cucumber/cucumber';
import {
  consulterGestionnaireRéseauQueryHandlerFactory,
  GestionnaireRéseauInconnuError,
  GestionnaireRéseauReadModel,
  listerGestionnaireRéseauQueryHandlerFactory,
  modifierGestionnaireRéseauFactory,
} from '@potentiel/domain';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel/pg-projections';
import waitForExpect from 'wait-for-expect';
import { GestionnaireRéseauWorld } from './gestionnaireRéseau.world';

// Example
const codeEIC = '17X100A100A0001A';

setWorldConstructor(GestionnaireRéseauWorld);

EtantDonné('un gestionnaire de réseau', async function (this: GestionnaireRéseauWorld) {
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
  "un administrateur modifie la raison sociale d'un gestionnaire de réseau inconnu",
  async function (this: GestionnaireRéseauWorld) {
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

Alors(
  'le gestionnaire de réseau devrait être mis à jour',
  async function (this: GestionnaireRéseauWorld) {
    const expected: GestionnaireRéseauReadModel = {
      type: 'gestionnaire-réseau',
      codeEIC,
      raisonSociale: 'RTE',
      aideSaisieRéférenceDossierRaccordement: {
        format: 'AAA-BBB',
        légende: 'des lettres séparées par un tiret',
      },
    };

    this.actual?.should.be.deep.equal(expected);

    this.actualList?.should.deep.contain(expected);
  },
);
