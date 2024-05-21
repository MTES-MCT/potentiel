import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { getLogger } from '@potentiel-libraries/monitoring';
import { mediator } from 'mediateur';
import { Params } from '.';

export const addNewGestionnairesDeRéseau = async ({
  gestionnairesFromORE,
  gestionnairesRéseau,
}: Params) => {
  const gestionnairesRéseauEICFromDb = gestionnairesRéseau.items.map(
    (gestionnaire) => gestionnaire.identifiantGestionnaireRéseau.codeEIC,
  );

  const newGestionnairesRéseaux = gestionnairesFromORE.filter(
    (gestionnaire) => !gestionnairesRéseauEICFromDb.includes(gestionnaire.eic),
  );

  newGestionnairesRéseaux.length
    ? getLogger().info(
        '[updateGestionnaireDeRéseau] Des nouveaux gestionnaires de réseau vont être ajoutés',
        { nouveauxGestionnaires: newGestionnairesRéseaux },
      )
    : getLogger().info(
        "[updateGestionnaireDeRéseau] Il n'y a pas de nouveaux gestionnaires de réseaux",
      );

  for (const newGestionnaireRéseaux of newGestionnairesRéseaux) {
    try {
      await mediator.send<GestionnaireRéseau.GestionnaireRéseauUseCase>({
        type: 'Réseau.Gestionnaire.UseCase.AjouterGestionnaireRéseau',
        data: {
          aideSaisieRéférenceDossierRaccordementValue: {},
          identifiantGestionnaireRéseauValue: newGestionnaireRéseaux.eic,
          raisonSocialeValue: newGestionnaireRéseaux.grd,
          contactEmailValue: newGestionnaireRéseaux.contact ?? undefined,
        },
      });
    } catch (error) {
      getLogger().error(error as Error);
    }
  }
};
