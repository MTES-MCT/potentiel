import { Given as EtantDonné, When as Quand, Then as Alors, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import { mediator } from 'mediateur';
import { DomainUseCase, convertirEnIdentifiantGestionnaireRéseau } from '@potentiel/domain';
import {
  ConsulterGestionnaireRéseauQuery,
  GestionnaireRéseauReadModel,
  ListerGestionnaireRéseauQuery,
} from '@potentiel/domain-views';

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
    this.gestionnaireRéseauWorld.expressionReguliere = example['Expression régulière'];

    await mediator.send<DomainUseCase>({
      type: 'MODIFIER_GESTIONNAIRE_RÉSEAU_USECASE',
      data: {
        identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(
          this.gestionnaireRéseauWorld.codeEIC,
        ),
        raisonSociale: this.gestionnaireRéseauWorld.raisonSociale,
        aideSaisieRéférenceDossierRaccordement: {
          format: this.gestionnaireRéseauWorld.format,
          légende: this.gestionnaireRéseauWorld.légende,
          expressionReguliere: this.gestionnaireRéseauWorld.expressionReguliere,
        },
      },
    });
  },
);

Quand(
  'un administrateur modifie un gestionnaire de réseau inconnu',
  async function (this: PotentielWorld) {
    try {
      await mediator.send<DomainUseCase>({
        type: 'MODIFIER_GESTIONNAIRE_RÉSEAU_USECASE',
        data: {
          identifiantGestionnaireRéseau:
            convertirEnIdentifiantGestionnaireRéseau('Code EIC inconnu'),
          raisonSociale: 'RTE',
          aideSaisieRéférenceDossierRaccordement: {
            format: 'AAA-BBB',
            légende: 'des lettres séparées par un tiret',
            expressionReguliere: '.',
          },
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Alors(
  `le gestionnaire de réseau devrait être à jour dans le référenciel des gestionnaires de réseau`,
  async function (this: PotentielWorld) {
    const expected: GestionnaireRéseauReadModel = {
      type: 'gestionnaire-réseau',
      codeEIC: this.gestionnaireRéseauWorld.codeEIC,
      raisonSociale: this.gestionnaireRéseauWorld.raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        format: this.gestionnaireRéseauWorld.format,
        légende: this.gestionnaireRéseauWorld.légende,
        expressionReguliere: this.gestionnaireRéseauWorld.expressionReguliere,
      },
    };

    const actual = await mediator.send<ListerGestionnaireRéseauQuery>({
      type: 'LISTER_GESTIONNAIRE_RÉSEAU_QUERY',
      data: {},
    });

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
        expressionReguliere: this.gestionnaireRéseauWorld.expressionReguliere,
      },
    };

    const actual = await mediator.send<ConsulterGestionnaireRéseauQuery>({
      type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY',
      data: {
        identifiantGestionnaireRéseau: this.gestionnaireRéseauWorld.codeEIC,
      },
    });

    actual.should.be.deep.equal(expected);
  },
);
