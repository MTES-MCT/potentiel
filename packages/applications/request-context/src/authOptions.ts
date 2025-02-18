import { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { mediator, Message } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';
import { Role } from '@potentiel-domain/utilisateur';

import { getProviderConfiguration } from './constants';
import { refreshToken } from './refreshToken';
import ProConnectProvider from './ProConnectProvider';
import { getUtilisateurFromEmail } from './getUtilisateur';
import { signIn } from './signIn';

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider(getProviderConfiguration('keycloak')),
    ProConnectProvider(getProviderConfiguration('proconnect')),
  ],
  session: {
    strategy: 'jwt',
    // This is the max age for the next-auth cookie
    // It is renewed on each page refresh, so this represents inactivity time.
    // Moreover, the user will not be disconnected after expiration (if their Keycloak session still exists),
    // but there will be a redirection to keycloak.
    maxAge: getTokenMaxAge(),
  },
  events: {
    signIn: async ({ user: { email } }) => {
      await ajouterStatistiqueConnexion(email ?? '');
    },
  },
  callbacks: {
    // Stores user data and idToken to the next-auth cookie
    async jwt({ token, account, trigger }) {
      if (trigger === 'signIn' && account) {
        return await signIn({
          token,
          account,
        });
      }

      return await refreshToken(token);
    },
    session({ session, token }) {
      {
        if (token.utilisateur) {
          session.utilisateur = token.utilisateur;
        }

        if (token.provider) {
          session.provider = token.provider;
        }

        return session;
      }
    },
  },
};

function getTokenMaxAge() {
  const OneHourInSeconds = 60 * 60;
  return parseInt(process.env.SESSION_MAX_AGE ?? String(OneHourInSeconds), 10);
}

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

async function ajouterStatistiqueConnexion(email: string) {
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
