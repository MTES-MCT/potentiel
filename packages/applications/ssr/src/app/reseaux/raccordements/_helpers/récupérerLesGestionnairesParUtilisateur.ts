import { mediator } from 'mediateur';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

export const récupérerLesGestionnairesParUtilisateur = async (
  utilisateur: Utilisateur.ValueType,
) => {
  if (utilisateur.role.estÉgaleÀ(Role.grd)) {
    if (Option.isSome(utilisateur.identifiantGestionnaireRéseau)) {
      const gestionnaireRéseau =
        await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>({
          type: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
          data: {
            identifiantGestionnaireRéseau: utilisateur.identifiantGestionnaireRéseau,
          },
        });
      if (Option.isSome(gestionnaireRéseau)) {
        return [gestionnaireRéseau];
      }
    }
    return [];
  }
  const listeGestionnaireRéseau =
    await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
      type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
      data: {},
    });
  return listeGestionnaireRéseau.items;
};
