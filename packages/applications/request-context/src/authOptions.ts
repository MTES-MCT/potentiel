import { Pool } from 'pg';
import { AuthOptions } from 'next-auth';
import { Provider } from 'next-auth/providers';
import KeycloakProvider from 'next-auth/providers/keycloak';
import EmailProvider from 'next-auth/providers/email';

import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { PostgresAdapter } from '@potentiel-libraries/auth-pg-adapter';
import { Option } from '@potentiel-libraries/monads';
import { sendEmail } from '@potentiel-infrastructure/email';

import { getProviderConfiguration } from './getProviderConfiguration';
import { refreshToken } from './refreshToken';
import ProConnectProvider from './ProConnectProvider';
import { getSessionUtilisateurFromEmail, getUtilisateurFromEmail } from './getUtilisateur';
import { ajouterStatistiqueConnexion } from './ajouterStatistiqueConnexion';
import { canConnectWithProvider } from './canConnectWithProvider';

const OneHourInSeconds = 60 * 60;
const fifteenMinutesInSeconds = 15 * 60;

const pool = new Pool({
  connectionString: process.env.DATABASE_CONNECTION_STRING,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  application_name: 'potentiel_auth',
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
    signIn: async ({ account, user }) => {
      if (user?.email) {
        const utilisateur = await getSessionUtilisateurFromEmail(user.email);
        await ajouterStatistiqueConnexion(utilisateur, account?.provider ?? '');
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
