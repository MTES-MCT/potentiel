import { mediator } from 'mediateur';

import type { GestionnaireRéseau } from '@potentiel-domain/reseau';
import type { OreGestionnaire } from '@potentiel-infrastructure/ore-client';
import { getLogger } from '@potentiel-libraries/monitoring';

export const addGRDs = async (gestionnairesORE: ReadonlyArray<OreGestionnaire>) => {
  if (gestionnairesORE.length === 0) {
    getLogger().info("Il n'y a pas de nouveaux gestionnaires de réseaux à ajouter");
    return;
  }

  getLogger().info('Des nouveaux gestionnaires de réseau vont être ajoutés', {
    total: gestionnairesORE.length,
    gestionnaires: gestionnairesORE,
  });

  for (const gestionnaire of gestionnairesORE) {
    try {
      await mediator.send<GestionnaireRéseau.GestionnaireRéseauUseCase>({
        type: 'Réseau.Gestionnaire.UseCase.AjouterGestionnaireRéseau',
        data: {
          aideSaisieRéférenceDossierRaccordementValue: {},
          identifiantGestionnaireRéseauValue: gestionnaire.eic ?? gestionnaire.grd,
          raisonSocialeValue: gestionnaire.grd,
          contactEmailValue: gestionnaire.contact ?? undefined,
        },
      });
    } catch (error) {
      getLogger().error(error as Error, {
        gestionnaire,
      });
    }
  }
};
