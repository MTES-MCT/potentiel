import { betterAuth } from 'better-auth';
import { genericOAuth, keycloak, lastLoginMethod, magicLink } from 'better-auth/plugins';
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
  hooks: {
    // after: createAuthMiddleware(async (ctx) => {
    //   // TODO log auth events
    //   console.log('AFTER', ctx.method, ctx.context);
    //   return {
    //     context: ctx,
    //   };
    // }),
  },
  plugins: [
    genericOAuth({
      config: [
        keycloak(getKeycloakConfiguration()),
        proconnect(getProconnectConfiguration()),
      ].filter(({ providerId }) => process.env.AUTH_PROVIDERS?.split(',').includes(providerId)),
    }),
    magicLink({
      sendMagicLink: buildSendMagicLink(sendEmail, getUtilisateurFromEmail),
    }),
    lastLoginMethod(),
  ],
});
