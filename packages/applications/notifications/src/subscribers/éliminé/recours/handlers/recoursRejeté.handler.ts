import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import {
  getBaseUrl,
  listerCreRecipients,
  listerDgecRecipients,
  listerPorteursRecipients,
} from '#helpers';

import { recoursNotificationTemplateId } from '../constant.js';
import { RecoursNotificationsProps } from '../type.js';

export const handleRecoursRejeté = async ({
  sendEmail,
  event,
  projet,
}: RecoursNotificationsProps<Éliminé.Recours.RecoursRejetéEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);

  const porteursRecipients = await listerPorteursRecipients(identifiantProjet);
  const adminRecipients = await listerDgecRecipients(identifiantProjet);
  const creRecipients = await listerCreRecipients();

  await sendEmail({
    templateId: recoursNotificationTemplateId.rejeter,
    messageSubject: `Potentiel - Demande de recours rejetée pour le projet ${projet.nom} (${identifiantProjet.appelOffre} période ${identifiantProjet.période})`,
    recipients: porteursRecipients,
    bcc: [...adminRecipients, ...creRecipients],
    variables: {
      nom_projet: projet.nom,
      redirect_url: `${getBaseUrl()}${Routes.Recours.détailPourRedirection(identifiantProjet.formatter())}`,
      departement_projet: projet.département,
    },
  });
};
