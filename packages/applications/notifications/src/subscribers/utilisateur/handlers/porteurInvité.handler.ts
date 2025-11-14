import { Routes } from '@potentiel-applications/routes';
import { Email } from '@potentiel-domain/common';
import { PorteurInvitéEvent } from '@potentiel-domain/utilisateur';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getBaseUrl, getCandidature, NotificationHandlerProps } from '@/helpers';

import { utilisateurNotificationTemplateId } from '../constant.js';

export const handlePorteurInvité = async ({
  event: {
    payload: { identifiantsProjet, identifiantUtilisateur, invitéPar },
  },
  sendEmail,
}: NotificationHandlerProps<PorteurInvitéEvent>) => {
  const projets = await Promise.all(
    identifiantsProjet.map((identifiantProjet) =>
      getCandidature(IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter()),
    ),
  );

  const urlPageProjets = `${getBaseUrl()}${Routes.Lauréat.lister()}`;

  // On ne notifie pas le porteur invité par le système,
  // car cela correspond à l'invitation liée à la candidature,
  // pour laquelle le porteur est déjà notifié
  if (Email.convertirEnValueType(invitéPar).estSystème()) {
    return;
  }

  await sendEmail({
    templateId: utilisateurNotificationTemplateId.inviter.porteur,
    messageSubject: `Invitation à suivre les projets sur Potentiel`,
    recipients: [{ email: identifiantUtilisateur }],
    variables: {
      nomProjet: projets
        .filter(Boolean)
        .map(({ nom }) => nom)
        .join(', '),
      invitation_link: urlPageProjets,
    },
  });
};
