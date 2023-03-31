import {
  Given as EtantDonné,
  When as Quand,
  Then as Alors,
  DataTable,
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

EtantDonné(
  'un gestionnaire de réseau',
  async function (this: GestionnaireRéseauWorld, table: DataTable) {
    const gestionnaireRéseau = table.rowsHash();

    await this.createGestionnaireRéseau(
      gestionnaireRéseau['Code EIC'],
      gestionnaireRéseau['Raison sociale'],
    );
  },
);

Quand(
  'un administrateur modifie les données du gestionnaire de réseau',
  async function (this: GestionnaireRéseauWorld, table: DataTable) {
    const gestionnaireRéseau = table.rowsHash();
    const modifierGestionnaireRéseau = modifierGestionnaireRéseauFactory({
      publish,
      loadAggregate,
    });

    await modifierGestionnaireRéseau({
      codeEIC: this.codeEIC,
      raisonSociale: gestionnaireRéseau['Raison sociale'],
      aideSaisieRéférenceDossierRaccordement: {
        format: gestionnaireRéseau['Format'],
        légende: gestionnaireRéseau['Légende'],
      },
    });
  },
);

Quand(
  'un administrateur modifie un gestionnaire de réseau inconnu',
  async function (this: GestionnaireRéseauWorld) {
    const modifierGestionnaireRéseau = modifierGestionnaireRéseauFactory({
      publish,
      loadAggregate,
    });

    try {
      await modifierGestionnaireRéseau({
        codeEIC: 'Code EIC inconnu',
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

  const listerGestionnaireRéseau = listerGestionnaireRéseauQueryHandlerFactory({
    listGestionnaireRéseau: listProjection,
  });

  await waitForExpect(async () => {
    const actual = await consulterGestionnaireRéseau({ codeEIC: this.codeEIC });
    const actualList = await listerGestionnaireRéseau({});

    const expected: GestionnaireRéseauReadModel = {
      type: 'gestionnaire-réseau',
      codeEIC: this.codeEIC,
      raisonSociale: 'RTE',
      aideSaisieRéférenceDossierRaccordement: {
        format: 'XXX',
        légende: 'Trois lettres',
      },
    };

    actual.should.be.deep.equal(expected);
    actualList.should.deep.contain(expected);
  });
});
