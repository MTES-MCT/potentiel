import { Pool } from 'pg';
import { AuthOptions } from 'next-auth';
import { Provider } from 'next-auth/providers/index';
import KeycloakProvider from 'next-auth/providers/keycloak';
import EmailProvider from 'next-auth/providers/email';
import { mediator } from 'mediateur';
import PostgresAdapter from '@auth/pg-adapter';

import { getConnectionString } from '@potentiel-libraries/pg-helpers';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';
import { EnvoyerNotificationCommand } from '@potentiel-applications/notifications';
import { SendEmailV2 } from '@potentiel-applications/notifications';
import { AjouterStatistiqueUtilisationCommand } from '@potentiel-domain/statistiques-utilisation';

import { getProviderConfiguration } from './getProviderConfiguration.js';
import { refreshToken } from './refreshToken.js';
import ProConnectProvider from './ProConnectProvider.js';
import { getSessionUtilisateurFromEmail, getUtilisateurFromEmail } from './getUtilisateur.js';
import { canConnectWithProvider } from './canConnectWithProvider.js';
import { buildSendVerificationRequest } from './sendVerificationRequest.js';

const OneHourInSeconds = 60 * 60;
const fifteenMinutesInSeconds = 15 * 60;

const pool = new Pool({
  connectionString: getConnectionString(),
  max: Number(process.env.DATABASE_AUTH_POOL_MAX) || 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  application_name: 'potentiel_auth',
  options: '-c search_path=auth',
});

const sendEmail: SendEmailV2 = async (data) => {
  await mediator.send<EnvoyerNotificationCommand>({ type: 'System.Notification.Envoyer', data });
};

const getAuthProviders = () => {
  const providers: Array<Provider> = [];
  const configuredProviders = process.env.NEXTAUTH_PROVIDERS?.split(',') ?? [];

  if (configuredProviders.includes('keycloak')) {
    providers.push(
      KeycloakProvider.default({
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
      EmailProvider.default({
        from: process.env.SEND_EMAILS_FROM,
        maxAge: fifteenMinutesInSeconds,
        sendVerificationRequest: buildSendVerificationRequest(sendEmail, getUtilisateurFromEmail),
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
    signIn: async ({ account, user }) => {
      if (user?.email) {
        const utilisateur = await getSessionUtilisateurFromEmail(user.email);

        await mediator.send<AjouterStatistiqueUtilisationCommand>({
          type: 'System.Statistiques.AjouterStatistiqueUtilisation',
          data: {
            type: 'connexionUtilisateur',
            données: {
              utilisateur: {
                role: utilisateur.rôle.nom,
                email: utilisateur.identifiantUtilisateur.email,
              },
              provider: account?.provider ?? '',
            },
          },
        });
      }
    },
  },
  callbacks: {
    async signIn({ account, user }) {
      const logger = getLogger('Auth');

      const utilisateur = await getUtilisateurFromEmail(user?.email ?? '');

      // Un utilisateur non existant aura le rôle porteur afin de pouvoir réclamer un projet
      if (Option.isNone(utilisateur)) {
        logger.info(`User tries to connect but is not registered yet`, {
          user,
          provider: account?.provider,
        });
        return true;
      }

      if (utilisateur.désactivé) {
        getLogger('Auth').info(
          `User tries to connect with '${account?.provider}' but is disabled`,
          { utilisateur },
        );
      }

      if (account?.provider && !canConnectWithProvider(account?.provider, utilisateur.rôle.nom)) {
        getLogger('Auth').info(
          `User tries to connect with '${account.provider}' but is not authorized`,
          { utilisateur },
        );
      }

      return true;
    },
    jwt({ token, trigger, account, profile }) {
      if (['signIn', 'signUp'].includes(trigger ?? '') && account) {
        const { sub, expires_at = 0, provider } = account;
        const expiresAtInMs = expires_at * 1000;

        getLogger('Auth').debug(`User logged in`, {
          sub,
          expiresAt: new Date(expiresAtInMs),
          provider,
        });

        return {
          ...token,
          name: profile?.name ?? token.name,
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
          session.utilisateur = await getSessionUtilisateurFromEmail(
            session.user.email,
            token?.name ?? undefined,
          );
        }

        if (token.provider) {
          session.provider = token.provider;
        }

        return session;
      }
    },
  },
};
