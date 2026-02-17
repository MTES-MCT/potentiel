import { magicLink } from 'better-auth/plugins';
import { mediator } from 'mediateur';

import { EnvoyerNotificationCommand, SendEmailV2 } from '@potentiel-applications/notifications';

import { getUtilisateurFromEmail } from '../getUtilisateurFromEmail';

import { buildSendMagicLink } from './magic-link/buildSendMagicLink';

export const customMagicLink = () => {
  const sendEmail: SendEmailV2 = async (data) => {
    await mediator.send<EnvoyerNotificationCommand>({ type: 'System.Notification.Envoyer', data });
  };

  return magicLink({
    sendMagicLink: buildSendMagicLink(sendEmail, getUtilisateurFromEmail),
  });
};
