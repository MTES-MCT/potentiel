import { Message, mediator } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';
import { PlainType } from '@potentiel-domain/core';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';

type AjouterStatistique = Message<
  'System.Statistiques.AjouterStatistique',
  {
    type: 'connexionUtilisateur';
    données: {
      utilisateur: {
        role: Role.RawType;
      };
      provider: string;
    };
  }
>;

export async function ajouterStatistiqueConnexion(
  utilisateur: PlainType<Utilisateur.ValueType>,
  provider: string,
) {
  try {
    await mediator.send<AjouterStatistique>({
      type: 'System.Statistiques.AjouterStatistique',
      data: {
        type: 'connexionUtilisateur',
        données: { utilisateur: { role: utilisateur.role.nom }, provider },
      },
    });
  } catch (e) {
    getLogger('Auth').error("Impossible d'ajouter les statistiques de connexion", { cause: e });
  }
}
