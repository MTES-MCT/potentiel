import { type DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import type { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';

import type { PotentielWorld } from '../../potentiel.world.js';

Quand('le DGEC validateur ajoute un gestionnaire de réseau', async function (this: PotentielWorld) {
  try {
    const { codeEIC, raisonSociale, expressionReguliere, format, légende, contactEmail } =
      this.gestionnaireRéseauWorld.ajouterGestionnaireRéseauFixture.créer();

    await mediator.send<GestionnaireRéseau.GestionnaireRéseauUseCase>({
      type: 'Réseau.Gestionnaire.UseCase.AjouterGestionnaireRéseau',
      data: {
        identifiantGestionnaireRéseauValue: codeEIC,
        raisonSocialeValue: raisonSociale,
        aideSaisieRéférenceDossierRaccordementValue: {
          expressionReguliereValue: expressionReguliere,
          formatValue: format,
          légendeValue: légende,
        },
        contactEmailValue: contactEmail,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
});

Quand(
  'le DGEC validateur ajoute un gestionnaire de réseau avec un code EIC identique',
  async function (this: PotentielWorld) {
    try {
      const { codeEIC, raisonSociale, expressionReguliere, format, légende, contactEmail } =
        this.gestionnaireRéseauWorld.ajouterGestionnaireRéseauFixture.créer({
          codeEIC: this.gestionnaireRéseauWorld.ajouterGestionnaireRéseauFixture.codeEIC,
        });

      await mediator.send<GestionnaireRéseau.GestionnaireRéseauUseCase>({
        type: 'Réseau.Gestionnaire.UseCase.AjouterGestionnaireRéseau',
        data: {
          identifiantGestionnaireRéseauValue: codeEIC,
          raisonSocialeValue: raisonSociale,
          aideSaisieRéférenceDossierRaccordementValue: {
            expressionReguliereValue: expressionReguliere,
            formatValue: format,
            légendeValue: légende,
          },
          contactEmailValue: contactEmail,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le DGEC validateur modifie le gestionnaire de réseau`,
  async function (this: PotentielWorld) {
    const { codeEIC, raisonSociale, expressionReguliere, format, légende, contactEmail } =
      this.gestionnaireRéseauWorld.modifierGestionnaireRéseauFixture.créer({
        codeEIC: this.gestionnaireRéseauWorld.ajouterGestionnaireRéseauFixture.codeEIC,
      });

    try {
      await mediator.send<GestionnaireRéseau.GestionnaireRéseauUseCase>({
        type: 'Réseau.Gestionnaire.UseCase.ModifierGestionnaireRéseau',
        data: {
          identifiantGestionnaireRéseauValue: codeEIC,
          raisonSocialeValue: raisonSociale,
          aideSaisieRéférenceDossierRaccordementValue: {
            expressionReguliereValue: expressionReguliere,
            formatValue: format,
            légendeValue: légende,
          },
          contactEmailValue: contactEmail,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le DGEC validateur modifie le gestionnaire de réseau avec :`,
  async function (this: PotentielWorld, table: DataTable) {
    const exemple = table.rowsHash();
    const partialFixture = this.gestionnaireRéseauWorld.mapExempleToFixtureValues(exemple);

    const { codeEIC, raisonSociale, expressionReguliere, format, légende, contactEmail } =
      this.gestionnaireRéseauWorld.modifierGestionnaireRéseauFixture.créer({
        ...partialFixture,
        codeEIC: partialFixture.codeEIC
          ? partialFixture.codeEIC
          : this.gestionnaireRéseauWorld.ajouterGestionnaireRéseauFixture.codeEIC,
      });

    try {
      await mediator.send<GestionnaireRéseau.GestionnaireRéseauUseCase>({
        type: 'Réseau.Gestionnaire.UseCase.ModifierGestionnaireRéseau',
        data: {
          identifiantGestionnaireRéseauValue: codeEIC,
          raisonSocialeValue: raisonSociale,
          aideSaisieRéférenceDossierRaccordementValue: {
            expressionReguliereValue: expressionReguliere,
            formatValue: format,
            légendeValue: légende,
          },
          contactEmailValue: contactEmail,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le DGEC validateur modifie le gestionnaire de réseau avec les mêmes valeurs`,
  async function (this: PotentielWorld) {
    const { codeEIC, raisonSociale, expressionReguliere, format, légende, contactEmail } =
      this.gestionnaireRéseauWorld.modifierGestionnaireRéseauFixture.créer({
        codeEIC: this.gestionnaireRéseauWorld.ajouterGestionnaireRéseauFixture.codeEIC,
        raisonSociale: this.gestionnaireRéseauWorld.ajouterGestionnaireRéseauFixture.raisonSociale,
        expressionReguliere:
          this.gestionnaireRéseauWorld.ajouterGestionnaireRéseauFixture.expressionReguliere,
        format: this.gestionnaireRéseauWorld.ajouterGestionnaireRéseauFixture.format,
        légende: this.gestionnaireRéseauWorld.ajouterGestionnaireRéseauFixture.légende,
        contactEmail: this.gestionnaireRéseauWorld.ajouterGestionnaireRéseauFixture.contactEmail,
      });

    try {
      await mediator.send<GestionnaireRéseau.ModifierGestionnaireRéseauUseCase>({
        type: 'Réseau.Gestionnaire.UseCase.ModifierGestionnaireRéseau',
        data: {
          identifiantGestionnaireRéseauValue: codeEIC,
          raisonSocialeValue: raisonSociale,
          aideSaisieRéférenceDossierRaccordementValue: {
            expressionReguliereValue: expressionReguliere,
            formatValue: format,
            légendeValue: légende,
          },
          contactEmailValue: contactEmail,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `on valide la référence de dossier {string} pour le gestionnaire de réseau {string}`,
  async function (
    this: PotentielWorld,
    référenceÀValider: string,
    raisonSocialeGestionnaireRéseau: string,
  ) {
    const { codeEIC } = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
      raisonSocialeGestionnaireRéseau,
    );

    const actualReadModel =
      await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>({
        data: {
          identifiantGestionnaireRéseau: codeEIC,
        },
        type: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
      });

    const résultatValidation =
      !Option.isNone(actualReadModel) &&
      actualReadModel.aideSaisieRéférenceDossierRaccordement.expressionReguliere.valider(
        référenceÀValider,
      );

    this.gestionnaireRéseauWorld.résultatsValidation.set(référenceÀValider, résultatValidation);
  },
);
