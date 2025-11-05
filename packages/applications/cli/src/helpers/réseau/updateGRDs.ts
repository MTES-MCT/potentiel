import { mediator } from 'mediateur';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';

import { RéférencielGRD } from './référencielGRD';

export const updateGRDs = async (gestionnaires: RéférencielGRD['àModifier']) => {
  if (gestionnaires.length === 0) {
    getLogger().info("Il n'y a pas de gestionnaires de réseaux à mettre à jour");
    return;
  }
  getLogger().info('Des gestionnaires de réseau vont être mis à jour', {
    total: gestionnaires.length,
  });

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
              légendeValue: Option.match(
                gestionnaire.potentielGestionnaire.aideSaisieRéférenceDossierRaccordement.légende,
              )
                .some<string | undefined>((légende) => légende)
                .none(() => undefined),
              formatValue: Option.match(
                gestionnaire.potentielGestionnaire.aideSaisieRéférenceDossierRaccordement.format,
              )
                .some<string | undefined>((format) => format)
                .none(() => undefined),
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
