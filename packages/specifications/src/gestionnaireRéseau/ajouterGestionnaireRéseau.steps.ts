import { Given as EtantDonné, When as Quand, Then as Alors, DataTable } from '@cucumber/cucumber';
import {
  ajouterGestionnaireRéseauCommandHandlerFactory,
  consulterGestionnaireRéseauQueryHandlerFactory,
  GestionnaireRéseauReadModel,
  listerGestionnaireRéseauQueryHandlerFactory,
} from '@potentiel/domain';
import { publish, loadAggregate } from '@potentiel/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel/pg-projections';
import waitForExpect from 'wait-for-expect';
import { PotentielWorld } from '../potentiel.world';

EtantDonné(
  'un gestionnaire de réseau ayant pour code EIC {string}',
  async function (this: PotentielWorld, codeEIC: string) {
    await this.gestionnaireRéseauWorld.createGestionnaireRéseau(codeEIC, 'Une raison sociale');
  },
);

Quand(
  'un administrateur ajoute un gestionnaire de réseau',
  async function (this: PotentielWorld, table: DataTable) {
    const example = table.rowsHash();
    this.gestionnaireRéseauWorld.codeEIC = example['Code EIC'];
    this.gestionnaireRéseauWorld.raisonSociale = example['Raison sociale'];
    this.gestionnaireRéseauWorld.format = example['Format'];
    this.gestionnaireRéseauWorld.légende = example['Légende'];

    const ajouterGestionnaireRéseau = ajouterGestionnaireRéseauCommandHandlerFactory({
      publish,
      loadAggregate,
    });

    const command = {
      codeEIC: this.gestionnaireRéseauWorld.codeEIC,
      raisonSociale: this.gestionnaireRéseauWorld.raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        format: this.gestionnaireRéseauWorld.format,
        légende: this.gestionnaireRéseauWorld.légende,
      },
    };

    await ajouterGestionnaireRéseau(command);
  },
);

Quand(
  'un administrateur ajoute un gestionnaire de réseau ayant le même code EIC',
  async function (this: PotentielWorld) {
    const ajouterGestionnaireRéseau = ajouterGestionnaireRéseauCommandHandlerFactory({
      publish,
      loadAggregate,
    });

    try {
      await ajouterGestionnaireRéseau({
        codeEIC: this.gestionnaireRéseauWorld.codeEIC,
        raisonSociale: 'autre raison sociale',
        aideSaisieRéférenceDossierRaccordement: {
          format: 'autre format',
          légende: 'autre légende',
        },
      });
    } catch (err) {
      this.error = err as Error;
    }
  },
);

Alors(
  'le gestionnaire de réseau devrait être disponible dans le référenciel des gestionnaires de réseau',
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
          légende: this.gestionnaireRéseauWorld.légende,
          format: this.gestionnaireRéseauWorld.format,
        },
      };

      const actual = await listerGestionnaireRéseau({
        codeEIC: this.gestionnaireRéseauWorld.codeEIC,
      });

      actual.should.deep.contain(expected);
    });
  },
);

Alors(
  `l'administrateur devrait pouvoir consulter les détails du gestionnaire de réseau`,
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
          légende: this.gestionnaireRéseauWorld.légende,
          format: this.gestionnaireRéseauWorld.format,
        },
      };

      const actual = await consulterGestionnaireRéseau({
        codeEIC: this.gestionnaireRéseauWorld.codeEIC,
      });

      actual.should.be.deep.equal(expected);
    });
  },
);
