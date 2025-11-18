import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { listerPorteursRecipients } from '#helpers';

import { puissanceNotificationTemplateId } from '../constant.js';
import { PuissanceNotificationsProps } from '../type.js';

export const handleChangementPuissanceAccordé = async ({
  sendEmail,
  event,
  projet,
}: PuissanceNotificationsProps<Lauréat.Puissance.ChangementPuissanceAccordéEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  return sendEmail({
    templateId: puissanceNotificationTemplateId.changement.accorder,
    messageSubject: `Potentiel - La demande de changement de puissance pour le projet ${projet.nom} dans le département ${projet.département} a été accordée`,
    recipients: porteurs,
    variables: {
      type: 'accord',
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
