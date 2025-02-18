import { Message, mediator } from 'mediateur';

import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';

import { getUtilisateurFromEmail } from './getUtilisateur';

type AjouterStatistique = Message<
  'System.Statistiques.AjouterStatistique',
  {
    type: 'connexionUtilisateur';
    données: {
      utilisateur: {
        role: Role.RawType;
      };
    };
  }
>;

export async function ajouterStatistiqueConnexion(email: string) {
  try {
    const utilisateur = await getUtilisateurFromEmail(email);

    await mediator.send<AjouterStatistique>({
      type: 'System.Statistiques.AjouterStatistique',
      data: {
        type: 'connexionUtilisateur',
        données: { utilisateur: { role: utilisateur.role.nom } },
      },
    });
  } catch (e) {
    getLogger('Auth').error("Impossible d'ajouter les statistiques de connexion", { cause: e });
  }
}
