import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { listerDgecRecipients, listerDrealsRecipients } from '#helpers';
import { Recipient } from '#sendEmail';

import { puissanceNotificationTemplateId } from '../constant.js';
import { PuissanceNotificationsProps } from '../type.js';

export const handleChangementPuissanceAnnulé = async ({
  sendEmail,
  event,
  projet,
}: PuissanceNotificationsProps<Lauréat.Puissance.ChangementPuissanceAnnuléEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  const recipients: Array<Recipient> = [...dreals];

  if (event.payload.autoritéCompétente === 'dgec-admin') {
    const dgecs = await listerDgecRecipients(identifiantProjet);

    recipients.push(...dgecs);
  }

  return sendEmail({
    templateId: puissanceNotificationTemplateId.changement.annuler,
    messageSubject: `Potentiel - La demande de changement de puissance pour le projet ${projet.nom} dans le département ${projet.département} a été annulée`,
    recipients,
    variables: {
      type: 'annulation',
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
