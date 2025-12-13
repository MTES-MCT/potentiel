import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, listerDgecRecipients, listerPorteursRecipients } from '#helpers';

import { recoursNotificationTemplateId } from '../constant.js';
import { RecoursNotificationsProps } from '../type.js';

export const handleRecoursAnnulé = async ({
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
      redirect_url: `${getBaseUrl()}${Routes.Recours.détailPourRedirection(identifiantProjet.formatter())}`,
      departement_projet: projet.département,
    },
  });
};
