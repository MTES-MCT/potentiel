import { Given as EtantDonné, When as Quand, Then as Alors, DataTable } from '@cucumber/cucumber';
import {
  consulterGestionnaireRéseauQueryHandlerFactory,
  GestionnaireRéseauReadModel,
  listerGestionnaireRéseauQueryHandlerFactory,
  modifierGestionnaireRéseauFactory,
} from '@potentiel/domain';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel/pg-projections';
import waitForExpect from 'wait-for-expect';
import { PotentielWorld } from '../potentiel.world';

EtantDonné('un gestionnaire de réseau', async function (this: PotentielWorld, table: DataTable) {
  const exemple = table.rowsHash();
  this.gestionnaireRéseauWorld.codeEIC = exemple['Code EIC'];
  this.gestionnaireRéseauWorld.raisonSociale = exemple['Raison sociale'];

  await this.gestionnaireRéseauWorld.createGestionnaireRéseau(
    this.gestionnaireRéseauWorld.codeEIC,
    this.gestionnaireRéseauWorld.raisonSociale,
  );
});

Quand(
  'un administrateur modifie les données du gestionnaire de réseau',
  async function (this: PotentielWorld, table: DataTable) {
    const example = table.rowsHash();
    this.gestionnaireRéseauWorld.raisonSociale = example['Raison sociale'];
    this.gestionnaireRéseauWorld.légende = example['Légende'];
    this.gestionnaireRéseauWorld.format = example['Format'];

    const modifierGestionnaireRéseau = modifierGestionnaireRéseauFactory({
      publish,
      loadAggregate,
    });

    await modifierGestionnaireRéseau({
      codeEIC: this.gestionnaireRéseauWorld.codeEIC,
      raisonSociale: this.gestionnaireRéseauWorld.raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        format: this.gestionnaireRéseauWorld.format,
        légende: this.gestionnaireRéseauWorld.légende,
      },
    });
  },
);

Quand(
  'un administrateur modifie un gestionnaire de réseau inconnu',
  async function (this: PotentielWorld) {
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
    } catch (err) {
      this.error = err as Error;
    }
  },
);

Alors(
  `le gestionnaire de réseau devrait être à jour dans le référenciel des gestionnaires de réseau`,
  async function (this: PotentielWorld) {
    const listerGestionnaireRéseau = listerGestionnaireRéseauQueryHandlerFactory({
      list: listProjection,
    });

    await waitForExpect(async () => {
      const expected: GestionnaireRéseauReadModel = {
        type: 'gestionnaire-réseau',
        codeEIC: this.gestionnaireRéseauWorld.codeEIC,
        raisonSociale: this.gestionnaireRéseauWorld.raisonSociale,
        aideSaisieRéférenceDossierRaccordement: {
          format: this.gestionnaireRéseauWorld.format,
          légende: this.gestionnaireRéseauWorld.légende,
        },
      };

      const actual = await listerGestionnaireRéseau({});
      actual.should.deep.contain(expected);
    });
  },
);

Alors(
  `l'administrateur devrait pouvoir consulter les détails à jour du gestionnaire de réseau`,
  async function (this: PotentielWorld) {
    const consulterGestionnaireRéseau = consulterGestionnaireRéseauQueryHandlerFactory({
      find: findProjection,
    });

    await waitForExpect(async () => {
      const expected: GestionnaireRéseauReadModel = {
        type: 'gestionnaire-réseau',
        codeEIC: this.gestionnaireRéseauWorld.codeEIC,
        raisonSociale: this.gestionnaireRéseauWorld.raisonSociale,
        aideSaisieRéférenceDossierRaccordement: {
          format: this.gestionnaireRéseauWorld.format,
          légende: this.gestionnaireRéseauWorld.légende,
        },
      };

      const actual = await consulterGestionnaireRéseau({
        codeEIC: this.gestionnaireRéseauWorld.codeEIC,
      });

      actual.should.be.deep.equal(expected);
    });
  },
);
