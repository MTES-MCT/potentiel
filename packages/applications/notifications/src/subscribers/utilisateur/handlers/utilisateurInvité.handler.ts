import { match, P } from 'ts-pattern';

import { Routes } from '@potentiel-applications/routes';
import { UtilisateurInvitéEvent } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';

import { getBaseUrl, listerDgecEtValidateursRecipients } from '#helpers';
import { EmailPayload, sendEmail } from '#sendEmail';

import { listerTeamRecipients } from '../../../helpers/listerTeamRecipients.js';

export async function handleUtilisateurInvité({
  payload: { identifiantUtilisateur, rôle },
}: UtilisateurInvitéEvent) {
  if (identifiantUtilisateur.endsWith('@clients')) {
    getLogger('handleUtilisateurInvité').info(
      `L'utilisateur ${identifiantUtilisateur} est un utilisateur API, aucune notification ne sera envoyée.`,
    );
    return;
  }

  if (rôle === 'visiteur') {
    throw new Error("Le rôle 'visiteur' ne peut pas être invité");
  }

  const urlPageProjets = `${getBaseUrl()}${Routes.Lauréat.lister()}`;

  const payload = match(rôle)
    .returnType<EmailPayload>()
    .with('dreal', () => ({
      key: 'utilisateur/inviter_dreal',
      recipients: [identifiantUtilisateur],
      values: { url: urlPageProjets },
    }))
    .with(
      P.union(
        'cocontractant',
        'caisse-des-dépôts',
        'ademe',
        'dgec-validateur',
        'cre',
        'dgec',
        'admin',
      ),
      () => ({
        key: 'utilisateur/inviter_partenaire',
        recipients: [identifiantUtilisateur],
        values: { url: urlPageProjets },
      }),
    )
    .with('grd', () => ({
      key: 'utilisateur/inviter_partenaire',
      recipients: [identifiantUtilisateur],
      values: { url: `${getBaseUrl()}${Routes.Raccordement.lister}` },
    }))
    .exhaustive();

  await sendEmail(payload);

  if (rôle === 'dgec-validateur') {
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
}
