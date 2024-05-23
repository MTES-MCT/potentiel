import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { getLogger } from '@potentiel-libraries/monitoring';
import { mediator } from 'mediateur';
import { OreGestionnaire } from '@potentiel-infrastructure/ore-client';

export const addGRDs = async (gestionnairesORE: ReadonlyArray<OreGestionnaire>) => {
  gestionnairesORE.length
    ? getLogger().info(
        '[updateGestionnaireDeRéseau] Des nouveaux gestionnaires de réseau vont être ajoutés',
        { total: gestionnairesORE.length, gestionnaires: gestionnairesORE },
      )
    : getLogger().info(
        "[updateGestionnaireDeRéseau] Il n'y a pas de nouveaux gestionnaires de réseaux",
      );

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
