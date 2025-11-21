import { match, P } from 'ts-pattern';

import { Routes } from '@potentiel-applications/routes';
import { UtilisateurInvitéEvent } from '@potentiel-domain/utilisateur';

import { getBaseUrl, listerAdminRecipients, NotificationHandlerProps } from '#helpers';

import { utilisateurNotificationTemplateId } from '../constant.js';

export async function handleUtilisateurInvité({
  event: {
    payload: { identifiantUtilisateur, rôle },
  },
  sendEmail,
}: NotificationHandlerProps<UtilisateurInvitéEvent>) {
  const urlPageProjets = `${getBaseUrl()}${Routes.Lauréat.lister()}`;

  const { templateId, invitation_link } = match(rôle)
    .returnType<{ templateId: number; invitation_link: string }>()
    .with('dreal', () => ({
      templateId: utilisateurNotificationTemplateId.inviter.dreal,
      invitation_link: urlPageProjets,
    }))
    .with(
      P.union('cocontractant', 'caisse-des-dépôts', 'ademe', 'dgec-validateur', 'cre', 'admin'),
      () => ({
        templateId: utilisateurNotificationTemplateId.inviter.partenaire,
        invitation_link: urlPageProjets,
      }),
    )
    .with('grd', () => ({
      templateId: utilisateurNotificationTemplateId.inviter.partenaire,
      invitation_link: `${getBaseUrl()}${Routes.Raccordement.lister}`,
    }))
    .exhaustive();

  await sendEmail({
    templateId,
    messageSubject: `Invitation à suivre les projets sur Potentiel`,
    recipients: [{ email: identifiantUtilisateur }],
    variables: {
      invitation_link,
    },
  });

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
