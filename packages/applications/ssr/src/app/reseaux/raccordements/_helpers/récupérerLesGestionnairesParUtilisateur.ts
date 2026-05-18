import { mediator } from 'mediateur';

import type { GestionnaireRéseau } from '@potentiel-domain/reseau';
import type { Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

export const récupérerLesGestionnairesParUtilisateur = async (
  utilisateur: Utilisateur.ValueType,
) => {
  if (utilisateur.estGrd()) {
    if (utilisateur.identifiantGestionnaireRéseau) {
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
