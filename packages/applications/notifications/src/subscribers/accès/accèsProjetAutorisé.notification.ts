import { Accès } from '@potentiel-domain/projet';

import { listerDrealsRecipients } from '../../helpers';

import { AccèsNotificationsProps } from './type';
import { accèsNotificationTemplateId } from './constant';

export async function accèsProjetAutoriséNotification({
  sendEmail,
  event: {
    payload: { identifiantUtilisateur },
  },
  projet: { nom, département, région, url },
}: AccèsNotificationsProps<Accès.AccèsProjetAutoriséEvent>) {
  const variables = {
    nom_projet: nom,
    departement_projet: département,
    projet_url: url,
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
