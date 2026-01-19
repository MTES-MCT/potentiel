import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import {
  getBaseUrl,
  listerCreRecipients,
  listerDgecRecipients,
  listerDrealsRecipients,
  listerPorteursRecipients,
} from '#helpers';

import { recoursNotificationTemplateId } from '../constant.js';
import { RecoursNotificationsProps } from '../type.js';

export const handleRecoursAccordé = async ({
  sendEmail,
  event,
  projet,
}: RecoursNotificationsProps<Éliminé.Recours.RecoursAccordéEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);

  const porteursRecipients = await listerPorteursRecipients(identifiantProjet);
  const adminRecipients = await listerDgecRecipients(identifiantProjet);
  const creRecipients = await listerCreRecipients();
  const drealRecipients = await listerDrealsRecipients(projet.région);

  await sendEmail({
    templateId: recoursNotificationTemplateId.accorder,
    messageSubject: `Potentiel - Demande de recours accordée pour le projet ${projet.nom} (${identifiantProjet.appelOffre} période ${identifiantProjet.période})`,
    recipients: porteursRecipients,
    bcc: [...adminRecipients, ...creRecipients, ...drealRecipients],
    variables: {
      nom_projet: projet.nom,
      redirect_url: `${getBaseUrl()}${Routes.Recours.détailPourRedirection(identifiantProjet.formatter())}`,
      departement_projet: projet.département,
    },
  });
};
