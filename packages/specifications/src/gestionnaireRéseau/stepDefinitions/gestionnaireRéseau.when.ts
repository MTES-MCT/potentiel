import { When as Quand, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../potentiel.world';
import {
  DomainUseCase,
  convertirEnIdentifiantGestionnaireRéseau,
  convertirEnRéférenceDossierRaccordement,
  loadGestionnaireRéseauAggregateFactory,
} from '@potentiel/domain';
import { mediator } from 'mediateur';
import { sleep } from '../../helpers/sleep';
import { loadAggregate } from '@potentiel/pg-event-sourcing';
import { isNone } from '@potentiel/monads';

Quand(
  'un administrateur ajoute un gestionnaire de réseau( avec le même code EIC)',
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

      await mediator.send<DomainUseCase>({
        type: 'AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE',
        data: {
          identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
          raisonSociale,
          aideSaisieRéférenceDossierRaccordement,
        },
      });

      this.gestionnaireRéseauWorld.gestionnairesRéseauFixtures.set(raisonSociale, {
        codeEIC,
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement,
      });
      await sleep(100);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un administrateur modifie les données d'un gestionnaire de réseau( inconnu)`,
  async function (this: PotentielWorld, table: DataTable) {
    const exemple = table.rowsHash();
    const raisonSociale = exemple['Raison sociale'];
    const codeEIC = exemple['Code EIC'] ?? raisonSociale.toUpperCase();
    const aideSaisieRéférenceDossierRaccordement = {
      format: exemple['Format'],
      légende: exemple['Légende'],
      expressionReguliere: exemple['Expression régulière'],
    };

    try {
      await mediator.send<DomainUseCase>({
        type: 'MODIFIER_GESTIONNAIRE_RÉSEAU_USECASE',
        data: {
          identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
          raisonSociale,
          aideSaisieRéférenceDossierRaccordement,
        },
      });

      this.gestionnaireRéseauWorld.gestionnairesRéseauFixtures.set(raisonSociale, {
        codeEIC,
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement,
      });
      await sleep(100);
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
    const gestionnaireRéseau = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
      raisonSocialeGestionnaireRéseau,
    );

    const actualAggregate = await loadGestionnaireRéseauAggregateFactory({ loadAggregate })(
      convertirEnIdentifiantGestionnaireRéseau(gestionnaireRéseau.codeEIC),
    );

    if (isNone(actualAggregate)) {
      throw new Error(`L'agrégat gestionnaire de réseau n'existe pas !`);
    }

    const résultatValidation = actualAggregate.validerRéférenceDossierRaccordement(
      convertirEnRéférenceDossierRaccordement(référenceÀValider),
    );

    this.gestionnaireRéseauWorld.résultatsValidation.set(référenceÀValider, résultatValidation);
  },
);
