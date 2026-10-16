import { magicLink } from 'better-auth/plugins';
import { mediator } from 'mediateur';

import type { EnvoyerNotificationCommand, SendEmail } from '@potentiel-applications/notifications';

import { getUtilisateurFromEmail } from '../../getUtilisateurFromEmail';
import type { ProfilAuthentification } from '../../profilAuthentification';
import { buildSendMagicLink } from './buildSendMagicLink';
import { peutUtiliserMagicLink } from './peutUtiliserMagicLink';

type Props = {
  profils: Record<ProfilAuthentification, boolean>;
};
/** Custom Magic Link plugin to add the providerId and setup dependencies */
export const customMagicLink = ({ profils }: Props) => {
  const sendEmail: SendEmail = async (data) => {
    await mediator.send<EnvoyerNotificationCommand>({ type: 'System.Notification.Envoyer', data });
  };

  return magicLink({
    sendMagicLink: buildSendMagicLink({
      sendEmail,
      getUtilisateurFromEmail,
      peutUtiliserMagicLink: (utilisateur) => peutUtiliserMagicLink(utilisateur, profils),
    }),
  });
};
