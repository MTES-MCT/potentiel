import { should } from 'chai';
import {
  Given as EtantDonné,
  When as Quand,
  Then as Alors,
  setWorldConstructor,
} from '@cucumber/cucumber';
import {
  consulterGestionnaireRéseauQueryHandlerFactory,
  GestionnaireRéseauInconnuError,
  listerGestionnaireRéseauQueryHandlerFactory,
  modifierGestionnaireRéseauFactory,
} from '@potentiel/domain';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel/pg-projections';
import waitForExpect from 'wait-for-expect';
import { ModifierGestionnaireRéseauWorld } from './modifierGestionnaireRéseau.world';

// Global
should();

// Example
const codeEIC = '17X100A100A0001A';

setWorldConstructor(ModifierGestionnaireRéseauWorld);

EtantDonné('un gestionnaire de réseau', async function (this: ModifierGestionnaireRéseauWorld) {
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
