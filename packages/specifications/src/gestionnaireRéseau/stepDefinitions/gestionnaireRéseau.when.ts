import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';

import { PotentielWorld } from '../../potentiel.world.js';

Quand(
  'le DGEC validateur ajoute un gestionnaire de réseau( avec le même code EIC)',
  async function (this: PotentielWorld, table: DataTable) {
    const exemple = table.rowsHash();

    try {
      const codeEIC = exemple['Code EIC'];
      const raisonSociale = exemple['Raison sociale'] ?? 'Une raison sociale';
      const aideSaisieRéférenceDossierRaccordement = {
        format: exemple['Format'],
        légende: exemple['Légende'],
        expressionReguliere: exemple['Expression régulière'],
      };
      const contactEmail = exemple['Email de contact'];

      await mediator.send<GestionnaireRéseau.GestionnaireRéseauUseCase>({
        type: 'Réseau.Gestionnaire.UseCase.AjouterGestionnaireRéseau',
        data: {
          identifiantGestionnaireRéseauValue: codeEIC,
          raisonSocialeValue: raisonSociale,
          aideSaisieRéférenceDossierRaccordementValue: {
            expressionReguliereValue: aideSaisieRéférenceDossierRaccordement.expressionReguliere,
            formatValue: aideSaisieRéférenceDossierRaccordement.format,
            légendeValue: aideSaisieRéférenceDossierRaccordement.légende,
          },
          contactEmailValue: contactEmail,
        },
      });

      this.gestionnaireRéseauWorld.gestionnairesRéseauFixtures.set(raisonSociale, {
        codeEIC,
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement,
        contactEmail,
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le DGEC validateur modifie les données d'un gestionnaire de réseau( inconnu)`,
  async function (this: PotentielWorld, table: DataTable) {
    const exemple = table.rowsHash();
    const raisonSociale = exemple['Raison sociale'];
    const codeEIC = exemple['Code EIC'] ?? raisonSociale.toUpperCase();
    const aideSaisieRéférenceDossierRaccordement = {
      format: exemple['Format'],
      légende: exemple['Légende'],
      expressionReguliere: exemple['Expression régulière'],
    };
    const contactEmail = exemple['Email de contact'];

    try {
      await mediator.send<GestionnaireRéseau.GestionnaireRéseauUseCase>({
        type: 'Réseau.Gestionnaire.UseCase.ModifierGestionnaireRéseau',
        data: {
          identifiantGestionnaireRéseauValue: codeEIC,
          raisonSocialeValue: raisonSociale,
          aideSaisieRéférenceDossierRaccordementValue: {
            expressionReguliereValue: aideSaisieRéférenceDossierRaccordement.expressionReguliere,
            formatValue: aideSaisieRéférenceDossierRaccordement.format,
            légendeValue: aideSaisieRéférenceDossierRaccordement.légende,
          },
          contactEmailValue: contactEmail,
        },
      });

      this.gestionnaireRéseauWorld.gestionnairesRéseauFixtures.set(raisonSociale, {
        codeEIC,
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement,
        contactEmail,
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
