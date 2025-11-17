import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { listerDgecRecipients, listerDrealsRecipients } from '#helpers';
import { Recipient } from '#sendEmail';

import { puissanceNotificationTemplateId } from '../constant.js';
import { PuissanceNotificationsProps } from '../type.js';

export const handleChangementPuissanceDemandé = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: PuissanceNotificationsProps<Lauréat.Puissance.ChangementPuissanceDemandéEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  const recipients: Array<Recipient> = [...dreals];

  if (event.payload.autoritéCompétente === 'dgec-admin') {
    const dgecs = await listerDgecRecipients(identifiantProjet);

    recipients.push(...dgecs);
  }

  return sendEmail({
    templateId: puissanceNotificationTemplateId.changement.demander,
    messageSubject: `Potentiel - Demande de changement de puissance pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Puissance.changement.détails(identifiantProjet.formatter(), event.payload.demandéLe)}`,
    },
  });
};
