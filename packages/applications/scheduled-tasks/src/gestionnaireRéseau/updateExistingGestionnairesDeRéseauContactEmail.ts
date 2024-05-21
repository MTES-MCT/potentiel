import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { mediator } from 'mediateur';
import { Params } from '.';

export const updateExistingGestionnairesDeRéseauContactEmail = async ({
  gestionnairesFromORE,
  gestionnairesRéseau,
}: Params) => {
  const gestionnairesRéseauToUpdate = gestionnairesRéseau.items.filter((gestionnaire) => {
    return gestionnairesFromORE.some(
      (g) =>
        g.eic === gestionnaire.identifiantGestionnaireRéseau.codeEIC &&
        g.contact &&
        (Option.isNone(gestionnaire.contactEmail) || g.contact !== gestionnaire.contactEmail.email),
    );
  });

  gestionnairesRéseauToUpdate.length
    ? getLogger().info(
        '[updateGestionnaireDeRéseau] Des gestionnaires de réseau vont être mis à jour',
        { gestionnairesToUpdate: gestionnairesRéseauToUpdate },
      )
    : getLogger().info(
        "[updateGestionnaireDeRéseau] Il n'y a pas de gestionnaires de réseaux à mettre à jour",
      );

  for (const gestionnaireRéseauToUpdate of gestionnairesRéseauToUpdate) {
    const relatedOreGestionnaireRéseau = gestionnairesFromORE.find(
      ({ eic }) => eic === gestionnaireRéseauToUpdate.identifiantGestionnaireRéseau.codeEIC,
    );

    if (!relatedOreGestionnaireRéseau) {
      throw new Error('related OreGestionnaireRéseau not found');
    }

    await mediator.send<GestionnaireRéseau.GestionnaireRéseauUseCase>({
      type: 'Réseau.Gestionnaire.UseCase.ModifierGestionnaireRéseau',
      data: {
        identifiantGestionnaireRéseauValue:
          gestionnaireRéseauToUpdate.identifiantGestionnaireRéseau.codeEIC,
        aideSaisieRéférenceDossierRaccordementValue: {
          expressionReguliereValue:
            gestionnaireRéseauToUpdate.aideSaisieRéférenceDossierRaccordement.expressionReguliere
              .expression,
          légendeValue: gestionnaireRéseauToUpdate.aideSaisieRéférenceDossierRaccordement.légende,
          formatValue: gestionnaireRéseauToUpdate.aideSaisieRéférenceDossierRaccordement.format,
        },
        raisonSocialeValue: gestionnaireRéseauToUpdate.raisonSociale,
        contactEmailValue: relatedOreGestionnaireRéseau.contact ?? undefined,
      },
    });
  }
};
