import type { GenericEndpointContext } from 'better-auth';

import type { SendEmail } from '@potentiel-applications/notifications';
import { Routes } from '@potentiel-applications/routes';
import type { Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import type { GetUtilisateurFromEmail } from '@/auth/getUtilisateurFromEmail';

type SendOptions = { email: string; url: string };

type BuildSendVerificationRequest = (props: {
  sendEmail: SendEmail;
  getUtilisateurFromEmail: GetUtilisateurFromEmail;
  peutUtiliserMagicLink: (utilisateur: Option.Type<Utilisateur.ValueType>) => boolean;
}) => (options: SendOptions, ctx?: GenericEndpointContext) => Promise<void>;

export const buildSendMagicLink: BuildSendVerificationRequest = ({
  sendEmail,
  getUtilisateurFromEmail,
  peutUtiliserMagicLink,
}) => {
  return async ({ email, url }) => {
    const baseUrl = process.env.BASE_URL ?? '';
    const utilisateur = await getUtilisateurFromEmail(email);

    const estDésactivé = Option.isSome(utilisateur) && utilisateur.désactivé;
    if (estDésactivé) {
      return;
    }

    if (peutUtiliserMagicLink(utilisateur)) {
      await sendEmail({
        key: 'auth/lien-magique',
        recipients: [email],
        values: { url },
      });

      return;
    }

    //
    await sendEmail({
      key: 'auth/proconnect-obligatoire',
      recipients: [email],
      values: {
        url: `${baseUrl}${Routes.Auth.signIn({ forceProConnect: true })}`,
      },
    });
  };
};
