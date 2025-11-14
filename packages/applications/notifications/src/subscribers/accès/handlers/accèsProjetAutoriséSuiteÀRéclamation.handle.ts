import { getBaseUrl, listerDrealsRecipients } from '@helpers';

import { Routes } from '@potentiel-applications/routes';
import { Accès } from '@potentiel-domain/projet';

import { accèsNotificationTemplateId } from '../constant';
import { AccèsNotificationsProps } from '../type';

export async function handleAccèsProjetAutoriséSuiteÀRéclamation({
  sendEmail,
  event: {
    payload: { identifiantProjet, identifiantUtilisateur },
  },
  candidature: { nom, région, département },
}: AccèsNotificationsProps<Accès.AccèsProjetAutoriséEvent>) {
  const variables = {
    nom_projet: nom,
    departement_projet: département,
    projet_url: `${getBaseUrl()}${Routes.Projet.details(identifiantProjet)}`,
  };

  await sendEmail({
    templateId: accèsNotificationTemplateId.accèsProjetAutorisé.porteur,
    messageSubject: `Potentiel - Récupération de la gestion du projet ${nom}`,
    recipients: [
      {
        email: identifiantUtilisateur,
      },
    ],
    variables,
  });

  const dreals = await listerDrealsRecipients(région);

  if (dreals.length > 0) {
    await sendEmail({
      templateId: accèsNotificationTemplateId.accèsProjetAutorisé.dreal,
      messageSubject: `Potentiel - Récupération de la gestion du projet ${nom}`,
      recipients: dreals,
      variables,
    });
  }
}
