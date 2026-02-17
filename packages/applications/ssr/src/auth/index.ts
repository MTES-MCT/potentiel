import { betterAuth } from 'better-auth';
import { genericOAuth, lastLoginMethod, magicLink } from 'better-auth/plugins';
import { mediator } from 'mediateur';

import { EnvoyerNotificationCommand, SendEmailV2 } from '@potentiel-applications/notifications';

import { getKeycloakConfiguration, getProconnectConfiguration } from './getProviderConfiguration';
import { proconnect } from './proconnect.provider';
import { buildSendMagicLink } from './buildSendMagicLink';
import { getUtilisateurFromEmail } from './getUtilisateurFromEmail';

const sendEmail: SendEmailV2 = async (data) => {
  await mediator.send<EnvoyerNotificationCommand>({ type: 'System.Notification.Envoyer', data });
};

export const auth = betterAuth({
  plugins: [
    genericOAuth({
      config: [
        proconnect(getKeycloakConfiguration()),
        proconnect(getProconnectConfiguration()),
      ].filter(({ providerId }) => process.env.AUTH_PROVIDERS?.split(',').includes(providerId)),
    }),
    magicLink({
      sendMagicLink: buildSendMagicLink(sendEmail, getUtilisateurFromEmail),
    }),
    lastLoginMethod(),
    // customSession(async (session, ctx) => {
    //   console.log(ctx.body);
    //   return session;
    // }),
  ],
});
