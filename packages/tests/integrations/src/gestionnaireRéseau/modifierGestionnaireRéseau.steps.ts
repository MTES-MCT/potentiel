import { Given as EtantDonné, When as Quand, Then as Alors, DataTable } from '@cucumber/cucumber';
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
    const exemple = table.rowsHash();
    this.codeEIC = exemple['Code EIC'];
    this.raisonSociale = exemple['Raison sociale'];

    await this.createGestionnaireRéseau(this.codeEIC, this.raisonSociale);
  },
);

Quand(
  'un administrateur modifie les données du gestionnaire de réseau',
  async function (this: GestionnaireRéseauWorld, table: DataTable) {
    const example = table.rowsHash();
    this.raisonSociale = example['Raison sociale'];
    this.légende = example['Légende'];
    this.format = example['Format'];

    const modifierGestionnaireRéseau = modifierGestionnaireRéseauFactory({
      publish,
      loadAggregate,
    });

    await modifierGestionnaireRéseau({
      codeEIC: this.codeEIC,
      raisonSociale: this.raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        format: this.format,
        légende: this.légende,
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

Alors(
  'le gestionnaire de réseau devrait être mis à jour',
  async function (this: GestionnaireRéseauWorld) {
    const consulterGestionnaireRéseau = consulterGestionnaireRéseauQueryHandlerFactory({
      findGestionnaireRéseau: findProjection,
    });

    const listerGestionnaireRéseau = listerGestionnaireRéseauQueryHandlerFactory({
      listGestionnaireRéseau: listProjection,
    });

    await waitForExpect(async () => {
      const expected: GestionnaireRéseauReadModel = {
        type: 'gestionnaire-réseau',
        codeEIC: this.codeEIC,
        raisonSociale: this.raisonSociale,
        aideSaisieRéférenceDossierRaccordement: {
          format: this.format,
          légende: this.légende,
        },
      };

      const actual = await consulterGestionnaireRéseau({ codeEIC: this.codeEIC });
      const actualList = await listerGestionnaireRéseau({});

      actual.should.be.deep.equal(expected);
      actualList.should.deep.contain(expected);
    });
  },
);
