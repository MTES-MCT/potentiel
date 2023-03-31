import { Given as EtantDonné, When as Quand, Then as Alors, DataTable } from '@cucumber/cucumber';
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
import { GestionnaireRéseauWorld } from './gestionnaireRéseau.world';

EtantDonné(
  'un gestionnaire de réseau ayant pour code EIC {string}',
  async function (this: GestionnaireRéseauWorld, codeEIC: string) {
    await this.createGestionnaireRéseau(codeEIC, 'Une raison sociale');
  },
);

Quand(
  'un administrateur ajoute un gestionnaire de réseau',
  async function (this: GestionnaireRéseauWorld, table: DataTable) {
    const example = table.rowsHash();
    this.codeEIC = example['Code EIC'];
    this.raisonSociale = example['Raison sociale'];
    this.format = example['Format'];
    this.légende = example['Légende'];

    const ajouterGestionnaireRéseau = ajouterGestionnaireRéseauCommandHandlerFactory({
      publish,
      loadAggregate,
    });

    const command = {
      codeEIC: this.codeEIC,
      raisonSociale: this.raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        format: this.format,
        légende: this.légende,
      },
    };

    await ajouterGestionnaireRéseau(command);
  },
);

Quand(
  'un administrateur ajoute un gestionnaire de réseau ayant le même code EIC',
  async function (this: GestionnaireRéseauWorld) {
    const ajouterGestionnaireRéseau = ajouterGestionnaireRéseauCommandHandlerFactory({
      publish,
      loadAggregate,
    });

    try {
      await ajouterGestionnaireRéseau({
        codeEIC: this.codeEIC,
        raisonSociale: 'autre raison sociale',
        aideSaisieRéférenceDossierRaccordement: {
          format: 'autre format',
          légende: 'autre légende',
        },
      });
    } catch (err) {
      if (err instanceof GestionnaireRéseauDéjàExistantError) {
        this.error = err;
      }
    }
  },
);

Alors(
  'le gestionnaire de réseau devrait être disponible dans le référenciel des gestionnaires de réseau',
  async function (this: GestionnaireRéseauWorld) {
    const listerGestionnaireRéseau = listerGestionnaireRéseauQueryHandlerFactory({
      listGestionnaireRéseau: listProjection,
    });

    await waitForExpect(async () => {
      const expected: GestionnaireRéseauReadModel = {
        type: 'gestionnaire-réseau',
        codeEIC: this.codeEIC,
        raisonSociale: this.raisonSociale,
        aideSaisieRéférenceDossierRaccordement: {
          légende: this.légende,
          format: this.format,
        },
      };

      const actual = await listerGestionnaireRéseau({ codeEIC: this.codeEIC });

      actual.should.deep.contain(expected);
    });
  },
);

Alors(
  `l'administrateur devrait pouvoir consulter les détails du gestionnaire de réseau`,
  async function (this: GestionnaireRéseauWorld) {
    const consulterGestionnaireRéseau = consulterGestionnaireRéseauQueryHandlerFactory({
      findGestionnaireRéseau: findProjection,
    });

    await waitForExpect(async () => {
      const expected: GestionnaireRéseauReadModel = {
        type: 'gestionnaire-réseau',
        codeEIC: this.codeEIC,
        raisonSociale: this.raisonSociale,
        aideSaisieRéférenceDossierRaccordement: {
          légende: this.légende,
          format: this.format,
        },
      };

      const actual = await consulterGestionnaireRéseau({ codeEIC: this.codeEIC });

      actual.should.be.deep.equal(expected);
    });
  },
);
