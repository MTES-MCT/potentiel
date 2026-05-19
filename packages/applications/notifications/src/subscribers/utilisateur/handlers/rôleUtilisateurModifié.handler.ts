import { Routes } from '@potentiel-applications/routes';
import type { RôleUtilisateurModifiéEvent } from '@potentiel-domain/utilisateur';

import { buildUrl, listerDgecEtValidateursRecipients } from '#helpers';
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
        url: buildUrl(Routes.Utilisateur.lister()),
        email: identifiantUtilisateur,
      },
    });
  }
}
