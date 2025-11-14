import { match, P } from 'ts-pattern';
import { getBaseUrl, NotificationHandlerProps } from '@/helpers';

import { Routes } from '@potentiel-applications/routes';
import { UtilisateurInvitéEvent } from '@potentiel-domain/utilisateur';

import { utilisateurNotificationTemplateId } from '../constant';

export async function handleUtilisateurInvité({
  event: {
    payload: { identifiantUtilisateur, rôle },
  },
  sendEmail,
}: NotificationHandlerProps<UtilisateurInvitéEvent>) {
  const urlPageProjets = `${getBaseUrl()}${Routes.Lauréat.lister()}`;

  const templateId = match(rôle)
    .returnType<number>()
    .with('dreal', () => utilisateurNotificationTemplateId.inviter.dreal)
    .with(
      P.union(
        'cocontractant',
        'grd',
        'caisse-des-dépôts',
        'ademe',
        'dgec-validateur',
        'cre',
        'admin',
      ),
      () => utilisateurNotificationTemplateId.inviter.partenaire,
    )
    .exhaustive();

  await sendEmail({
    templateId,
    messageSubject: `Invitation à suivre les projets sur Potentiel`,
    recipients: [{ email: identifiantUtilisateur }],
    variables: {
      invitation_link: urlPageProjets,
    },
  });
}
