import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerPorteursRecipients } from '#helpers';

import { puissanceNotificationTemplateId } from '../constant.js';
import { PuissanceNotificationsProps } from '../type.js';

export const handlePuissanceModifiée = async ({
  sendEmail,
  event,
  projet,
}: PuissanceNotificationsProps<Lauréat.Puissance.PuissanceModifiéeEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (porteurs.length === 0) {
    getLogger().error('Aucun porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
    });
    return;
  }

  return sendEmail({
    templateId: puissanceNotificationTemplateId.modifier,
    messageSubject: `Potentiel - Modification de la puissance du projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
