import { Given as EtantDonné, When as Quand, Then as Alors, DataTable } from '@cucumber/cucumber';
import {
  GestionnaireRéseauReadModel,
  buildConsulterGestionnaireRéseauUseCase,
  buildAjouterGestionnaireRéseauUseCase,
  buildListerGestionnaireRéseauUseCase,
} from '@potentiel/domain';
import { PotentielWorld } from '../potentiel.world';
import { mediator } from 'mediateur';

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
    this.gestionnaireRéseauWorld.expressionReguliere = example['Expression régulière'];

    const command = buildAjouterGestionnaireRéseauUseCase({
      codeEIC: this.gestionnaireRéseauWorld.codeEIC,
      raisonSociale: this.gestionnaireRéseauWorld.raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        format: this.gestionnaireRéseauWorld.format,
        légende: this.gestionnaireRéseauWorld.légende,
      },
      expressionReguliere: this.gestionnaireRéseauWorld.expressionReguliere,
    });

    await mediator.send(command);
  },
);

Quand(
  'un administrateur ajoute un gestionnaire de réseau ayant le même code EIC',
  async function (this: PotentielWorld) {
    try {
      const command = buildAjouterGestionnaireRéseauUseCase({
        codeEIC: this.gestionnaireRéseauWorld.codeEIC,
        raisonSociale: 'autre raison sociale',
        aideSaisieRéférenceDossierRaccordement: {
          format: 'autre format',
          légende: 'autre légende',
        },
      });

      await mediator.send(command);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Alors(
  'le gestionnaire de réseau devrait être disponible dans le référenciel des gestionnaires de réseau',
  async function (this: PotentielWorld) {
    const expected: GestionnaireRéseauReadModel = {
      type: 'gestionnaire-réseau',
      codeEIC: this.gestionnaireRéseauWorld.codeEIC,
      raisonSociale: this.gestionnaireRéseauWorld.raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        légende: this.gestionnaireRéseauWorld.légende,
        format: this.gestionnaireRéseauWorld.format,
      },
      expressionReguliere: this.gestionnaireRéseauWorld.expressionReguliere,
    };

    const actual = await mediator.send(buildListerGestionnaireRéseauUseCase({}));

    actual.should.deep.contain(expected);
  },
);

Alors(
  `l'administrateur devrait pouvoir consulter les détails du gestionnaire de réseau`,
  async function (this: PotentielWorld) {
    const expected: GestionnaireRéseauReadModel = {
      type: 'gestionnaire-réseau',
      codeEIC: this.gestionnaireRéseauWorld.codeEIC,
      raisonSociale: this.gestionnaireRéseauWorld.raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        légende: this.gestionnaireRéseauWorld.légende,
        format: this.gestionnaireRéseauWorld.format,
      },
      expressionReguliere: this.gestionnaireRéseauWorld.expressionReguliere,
    };

    const query = buildConsulterGestionnaireRéseauUseCase({
      identifiantGestionnaireRéseau: {
        codeEIC: this.gestionnaireRéseauWorld.codeEIC,
      },
    });

    const actual = await mediator.send(query);

    actual.should.be.deep.equal(expected);
  },
);
