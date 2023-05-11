import { Given as EtantDonné, When as Quand, Then as Alors, DataTable } from '@cucumber/cucumber';
import {
  createConsulterGestionnaireRéseauQuery,
  createModifierGestionnaireRéseauCommand,
  GestionnaireRéseauInconnuError,
  GestionnaireRéseauReadModel,
  listerGestionnaireRéseauQueryHandlerFactory,
} from '@potentiel/domain';
import { listProjection } from '@potentiel/pg-projections';
import { PotentielWorld } from '../potentiel.world';
import { mediator } from 'mediateur';

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

    const modifierGestionnaireRéseauCommand = createModifierGestionnaireRéseauCommand({
      codeEIC: this.gestionnaireRéseauWorld.codeEIC,
      raisonSociale: this.gestionnaireRéseauWorld.raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        format: this.gestionnaireRéseauWorld.format,
        légende: this.gestionnaireRéseauWorld.légende,
      },
    });

    await mediator.send(modifierGestionnaireRéseauCommand);
  },
);

Quand(
  'un administrateur modifie un gestionnaire de réseau inconnu',
  async function (this: PotentielWorld) {
    try {
      const modifierGestionnaireRéseauCommand = createModifierGestionnaireRéseauCommand({
        codeEIC: 'Code EIC inconnu',
        raisonSociale: 'RTE',
        aideSaisieRéférenceDossierRaccordement: {
          format: 'AAA-BBB',
          légende: 'des lettres séparées par un tiret',
        },
      });

      await mediator.send(modifierGestionnaireRéseauCommand);
    } catch (error) {
      if (error instanceof GestionnaireRéseauInconnuError) {
        this.error = error;
      }
    }
  },
);

Alors(
  `le gestionnaire de réseau devrait être à jour dans le référenciel des gestionnaires de réseau`,
  async function (this: PotentielWorld) {
    const listerGestionnaireRéseau = listerGestionnaireRéseauQueryHandlerFactory({
      list: listProjection,
    });

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
  },
);

Alors(
  `l'administrateur devrait pouvoir consulter les détails à jour du gestionnaire de réseau`,
  async function (this: PotentielWorld) {
    const expected: GestionnaireRéseauReadModel = {
      type: 'gestionnaire-réseau',
      codeEIC: this.gestionnaireRéseauWorld.codeEIC,
      raisonSociale: this.gestionnaireRéseauWorld.raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        format: this.gestionnaireRéseauWorld.format,
        légende: this.gestionnaireRéseauWorld.légende,
      },
    };

    const query = createConsulterGestionnaireRéseauQuery({
      codeEIC: this.gestionnaireRéseauWorld.codeEIC,
    });

    const actual = await mediator.send(query);

    actual.should.be.deep.equal(expected);
  },
);
