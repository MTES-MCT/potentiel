import { mediator } from 'mediateur';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

export const récupérerLesGestionnairesParUtilisateur = async (user: Utilisateur.ValueType) => {
  if (Option.isSome(user.groupe) && user.groupe.type === 'GestionnairesRéseau') {
    const identifiantGestionnaireRéseau = user.groupe.nom;
    const gestionnaireRéseau =
      await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
        data: {
          identifiantGestionnaireRéseau,
        },
      });
    if (Option.isSome(gestionnaireRéseau)) {
      return [gestionnaireRéseau];
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
