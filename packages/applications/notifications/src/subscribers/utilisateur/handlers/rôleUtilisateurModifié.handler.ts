import { Routes } from '@potentiel-applications/routes';
import { RôleUtilisateurModifiéEvent } from '@potentiel-domain/utilisateur';

import { getBaseUrl, listerAdminRecipients, NotificationHandlerProps } from '#helpers';

import { utilisateurNotificationTemplateId } from '../constant.js';

export async function handleRôleUtilisateurModifié({
  event: {
    payload: { identifiantUtilisateur, rôle },
  },
  sendEmail,
}: NotificationHandlerProps<RôleUtilisateurModifiéEvent>) {
  if (rôle === 'dgec-validateur') {
    const templateId = utilisateurNotificationTemplateId.informer.dgecValidateurInvité;
    const recipients = await listerAdminRecipients();
    await sendEmail({
      templateId,
      messageSubject: `Nouvel utilisateur DGEC Validateur sur Potentiel`,
      recipients: [],
      bcc: recipients,
      variables: {
        url: `${getBaseUrl()}${Routes.Utilisateur.lister()}`,
        email: identifiantUtilisateur,
      },
    });
  }
}
