import { GenericEndpointContext } from 'better-auth';

import { SendEmailV2 } from '@potentiel-applications/notifications';
import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';

import { GetUtilisateurFromEmail } from '@/auth/getUtilisateurFromEmail';

import { getProviders } from '../authProvider';

type SendOptions = { email: string; url: string };

type BuildSendVerificationRequest = (
  sendEmail: SendEmailV2,
  getUtilisateurFromEmail: GetUtilisateurFromEmail,
) => (options: SendOptions, ctx?: GenericEndpointContext) => Promise<void>;

export const buildSendMagicLink: BuildSendVerificationRequest = (
  sendEmail,
  getUtilisateurFromEmail,
) => {
  return async ({ email, url }, ctx) => {
    const utilisateur = await getUtilisateurFromEmail(email);

    const estDésactivé = Option.isSome(utilisateur) && utilisateur.désactivé;
    if (estDésactivé) {
      return;
    }
    const providers = getProviders();

    const isAgentPublic =
      Option.isSome(utilisateur) && (utilisateur.rôle.estDreal() || utilisateur.rôle.estDGEC());
    const isActifAgentsPublics = providers['magic-link']?.isActifAgentsPublics;

    if (isAgentPublic && !isActifAgentsPublics) {
      const baseUrl = ctx?.context.options.baseURL ?? '';
      await sendEmail({
        key: 'auth/proconnect-obligatoire',
        recipients: [email],
        values: {
          url: `${baseUrl}${Routes.Auth.signIn({ forceProConnect: true })}`,
        },
      });

      return;
    }

    await sendEmail({
      key: 'auth/lien-magique',
      recipients: [email],
      values: { url },
    });
  };
};
