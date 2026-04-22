import { Routes } from '@potentiel-applications/routes';
import { RôleUtilisateurModifiéEvent } from '@potentiel-domain/utilisateur';

import { getBaseUrl, listerDgecEtValidateursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

import { listerTeamRecipients } from '../../../helpers/listerTeamRecipients.js';

export async function handleRôleUtilisateurModifié({
  payload: { identifiantUtilisateur, rôle },
}: RôleUtilisateurModifiéEvent) {
  if (rôle !== 'dgec-validateur') {
    return;
  }
  const recipients = await listerDgecEtValidateursRecipients();
  const teamRecipients = listerTeamRecipients();

  for (const recipient of recipients.concat(teamRecipients)) {
    if (recipient === identifiantUtilisateur) {
      continue;
    }
    await sendEmail({
      key: 'utilisateur/informer_dgec_validateur_invité',
      recipients: [recipient],
      values: {
        url: `${getBaseUrl()}${Routes.Utilisateur.lister()}`,
        email: identifiantUtilisateur,
      },
    });
  }
}
