import { When as Quand, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../potentiel.world';
import { DomainUseCase, convertirEnIdentifiantGestionnaireRéseau } from '@potentiel/domain';
import { mediator } from 'mediateur';
import { sleep } from '../../helpers/sleep';

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
    const codeEIC = exemple['Code EIC'];
    const raisonSociale = exemple['Raison sociale'];
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
