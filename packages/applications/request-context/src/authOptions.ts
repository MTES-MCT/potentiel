import { Pool } from 'pg';
import { AuthOptions } from 'next-auth';
import { Provider } from 'next-auth/providers';
import KeycloakProvider from 'next-auth/providers/keycloak';
import EmailProvider from 'next-auth/providers/email';

import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { PostgresAdapter } from '@potentiel-libraries/auth-pg-adapter';
import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';
import { sendEmail } from '@potentiel-infrastructure/email';

import { getProviderConfiguration } from './getProviderConfiguration';
import { refreshToken } from './refreshToken';
import ProConnectProvider from './ProConnectProvider';
import { getUtilisateurFromEmail } from './getUtilisateur';
import { ajouterStatistiqueConnexion } from './ajouterStatistiqueConnexion';
import { canConnectWithProvider } from './canConnectWithProvider';

const OneHourInSeconds = 60 * 60;
const fifteenMinutesInSeconds = 15 * 60;

const pool = new Pool({
  connectionString: process.env.DATABASE_CONNECTION_STRING,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  options: '-c search_path=auth',
});

const getAuthProviders = () => {
  const providers: Array<Provider> = [];
  const configuredProviders = process.env.NEXTAUTH_PROVIDERS?.split(',') ?? [];

  if (configuredProviders.includes('keycloak')) {
    providers.push(
      KeycloakProvider({
        ...getProviderConfiguration('keycloak'),
        allowDangerousEmailAccountLinking: true,
      }),
    );
  }

  if (configuredProviders.includes('proconnect')) {
    providers.push(
      ProConnectProvider({
        ...getProviderConfiguration('proconnect'),
        allowDangerousEmailAccountLinking: true,
      }),
    );
  }

  if (configuredProviders.includes('email')) {
    providers.push(
      EmailProvider({
        from: process.env.SEND_EMAILS_FROM,
        maxAge: fifteenMinutesInSeconds,
        sendVerificationRequest: ({ identifier, url }) =>
          sendEmail({
            templateId: 6785365,
            messageSubject: 'Connexion à Potentiel',
            recipients: [{ email: identifier, fullName: '' }],
            variables: {
              url,
            },
          }),
      }),
    );
  }

  return providers;
};

export const authOptions: AuthOptions = {
  adapter: PostgresAdapter(pool),
  providers: getAuthProviders(),
  pages: {
    signIn: Routes.Auth.signIn(),
    error: Routes.Auth.error(),
    signOut: Routes.Auth.signOut(),
    verifyRequest: Routes.Auth.verifyRequest(),
  },
  session: {
    strategy: 'jwt',
    // This is the max age for the next-auth cookie
    // It is renewed on each page refresh, so this represents inactivity time.
    // Moreover, the user will not be disconnected after expiration (if their Keycloak session still exists),
    // but there will be a redirection to keycloak.
    maxAge: parseInt(process.env.SESSION_MAX_AGE ?? String(OneHourInSeconds)),
  },
  events: {
    signIn: async ({ user, account }) => {
      const utilisateur = await getUtilisateurFromEmail(user?.email ?? '');

      if (Option.isSome(utilisateur)) {
        ajouterStatistiqueConnexion(utilisateur, account?.provider ?? '');
      }
    },
  },
  callbacks: {
    async signIn({ account, user }) {
      const logger = getLogger('Auth');

      const utilisateur = await getUtilisateurFromEmail(user?.email ?? '');

      // TODO handle signup
      if (Option.isNone(utilisateur)) {
        logger.info(`User tries to connect but is not registered yet`, {
          user,
        });
        return Routes.Auth.signOut({
          proConnectNotAvailableForUser: true,
          idToken: account?.id_token,
        });
      }

      if (account?.provider && !canConnectWithProvider(account?.provider, utilisateur.role.nom)) {
        getLogger('Auth').info(
          `User tries to connect with '${account.provider}' but is not authorized`,
          { utilisateur },
        );
        return Routes.Auth.signIn({ error: 'Unauthorized' });
      }

      return true;
    },
    jwt({ token, trigger, account, profile }) {
      if (['signIn', 'signUp'].includes(trigger ?? '') && account) {
        const { sub, expires_at = 0, provider } = account;
        const expiresAtInMs = expires_at * 1000;

        getLogger('Auth').debug(`User logged in`, { sub, expiresAt: new Date(expiresAtInMs) });

        return {
          ...token,
          name:
            profile?.given_name || profile?.usual_name
              ? (profile.given_name ?? '') + ' ' + (profile.usual_name ?? '')
              : token.name,
          provider,
          idToken: account.id_token,
          expiresAt: expiresAtInMs,
          refreshToken: account.refresh_token,
          job: profile?.job,
        };
      }

      if (token.provider !== 'email') {
        return refreshToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      {
        if (session.user?.email) {
          const utilisateur = await getUtilisateurFromEmail(session.user?.email);
          if (Option.isSome(utilisateur)) {
            session.utilisateur = {
              ...mapToPlainObject(utilisateur),
              nom: token.name ?? utilisateur.nom,
            };
          }
        }

        if (token.provider) {
          session.provider = token.provider;
        }

        return session;
      }
    },
  },
};
