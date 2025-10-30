import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, listerDgecRecipients, listerPorteursRecipients } from '../../../_helpers';

import { recoursNotificationTemplateId } from './constant';
import { RecoursNotificationsProps } from './type';

export const recoursAnnuléNotification = async ({
  sendEmail,
  event,
  projet,
}: RecoursNotificationsProps<Éliminé.Recours.RecoursAnnuléEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteursRecipients = await listerPorteursRecipients(identifiantProjet);
  const adminRecipients = await listerDgecRecipients(identifiantProjet);

  await sendEmail({
    templateId: recoursNotificationTemplateId.annuler,
    messageSubject: `Potentiel - Demande de recours annulée pour le projet ${projet.nom} (${identifiantProjet.appelOffre} période ${identifiantProjet.période})`,
    recipients: porteursRecipients,
    bcc: adminRecipients,
    variables: {
      nom_projet: projet.nom,
      redirect_url: `${getBaseUrl()}${Routes.Recours.détail(identifiantProjet.formatter())}`,
      departement_projet: projet.département,
    },
  });
};
