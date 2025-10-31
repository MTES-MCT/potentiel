import { Message, mediator } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';
import { PlainType } from '@potentiel-domain/core';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { Email } from '@potentiel-domain/common';

type AjouterStatistique = Message<
  'System.Statistiques.AjouterStatistique',
  {
    type: 'connexionUtilisateur';
    données: {
      utilisateur: {
        role: Role.RawType;
        /**
         * @deprecated Cette information est stockée temporairement à des fins d'audit.
         * Une fois la migration keycloak terminée, on retirera on supprimera la donnée.
         */
        email: Email.RawType;
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
        données: {
          utilisateur: {
            role: utilisateur.rôle.nom,
            email: utilisateur.identifiantUtilisateur.email,
          },
          provider,
        },
      },
    });
  } catch (e) {
    getLogger('Auth').error("Impossible d'ajouter les statistiques de connexion", { cause: e });
  }
}
