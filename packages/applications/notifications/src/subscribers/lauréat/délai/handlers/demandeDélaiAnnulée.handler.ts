import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerRecipientsAutoritéInstructrice } from '../../../../helpers.js';
import { délaiNotificationTemplateId } from '../constant.js';
import { DélaiNotificationsProps } from '../type.js';

export const handleDemandeDélaiAnnulée = async ({
  sendEmail,
  event,
  projet,
}: DélaiNotificationsProps<Lauréat.Délai.DemandeDélaiAnnuléeEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const recipients = await listerRecipientsAutoritéInstructrice({
    identifiantProjet,
    région: projet.région,
    domain: 'délai',
  });

  if (recipients.length === 0) {
    getLogger().info('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
    });
    return;
  }

  return sendEmail({
    templateId: délaiNotificationTemplateId.demande.annuler,
    messageSubject: `Potentiel - La demande de délai pour le projet ${projet.nom} situé dans le département ${projet.département} a été annulée`,
    recipients,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
