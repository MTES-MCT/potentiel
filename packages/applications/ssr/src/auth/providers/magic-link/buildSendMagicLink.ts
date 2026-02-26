import { GenericEndpointContext } from 'better-auth';

import { SendEmailV2 } from '@potentiel-applications/notifications';
import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';

import { GetUtilisateurFromEmail } from '@/auth/getUtilisateurFromEmail';

type SendOptions = { email: string; url: string };

type BuildSendVerificationRequest = (props: {
  sendEmail: SendEmailV2;
  getUtilisateurFromEmail: GetUtilisateurFromEmail;
  isActifAgentsPublics: boolean;
}) => (options: SendOptions, ctx?: GenericEndpointContext) => Promise<void>;

export const buildSendMagicLink: BuildSendVerificationRequest = ({
  sendEmail,
  getUtilisateurFromEmail,
  isActifAgentsPublics,
}) => {
  return async ({ email, url }) => {
    const baseUrl = process.env.BASE_URL ?? '';
    const utilisateur = await getUtilisateurFromEmail(email);

    const estDésactivé = Option.isSome(utilisateur) && utilisateur.désactivé;
    if (estDésactivé) {
      return;
    }

    const isAgentPublic =
      Option.isSome(utilisateur) && (utilisateur.rôle.estDreal() || utilisateur.rôle.estDGEC());

    if (isAgentPublic && !isActifAgentsPublics) {
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
