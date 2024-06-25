import { mediator } from 'mediateur';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { getLogger } from '@potentiel-libraries/monitoring';

import { RéférencielGRD } from './référencielGRD';

export const updateGRDs = async (gestionnaires: RéférencielGRD['àModifier']) => {
  gestionnaires.length
    ? getLogger().info('Des gestionnaires de réseau vont être mis à jour', {
        total: gestionnaires.length,
      })
    : getLogger().info("Il n'y a pas de gestionnaires de réseaux à mettre à jour");

  for (const gestionnaire of gestionnaires) {
    if (gestionnaire.oreGestionnaire) {
      try {
        await mediator.send<GestionnaireRéseau.GestionnaireRéseauUseCase>({
          type: 'Réseau.Gestionnaire.UseCase.ModifierGestionnaireRéseau',
          data: {
            identifiantGestionnaireRéseauValue:
              gestionnaire.potentielGestionnaire.identifiantGestionnaireRéseau.codeEIC,
            aideSaisieRéférenceDossierRaccordementValue: {
              expressionReguliereValue:
                gestionnaire.potentielGestionnaire.aideSaisieRéférenceDossierRaccordement
                  .expressionReguliere.expression,
              légendeValue:
                gestionnaire.potentielGestionnaire.aideSaisieRéférenceDossierRaccordement.légende,
              formatValue:
                gestionnaire.potentielGestionnaire.aideSaisieRéférenceDossierRaccordement.format,
            },
            raisonSocialeValue: gestionnaire.oreGestionnaire.grd,
            contactEmailValue: gestionnaire.oreGestionnaire.contact ?? undefined,
          },
        });
      } catch (error) {
        getLogger().error(error as Error, {
          gestionnaire,
        });
      }
    }
  }
};
