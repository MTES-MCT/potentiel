import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerRecipientsAutoritéInstructrice } from '../../../../_helpers/listerRecipientsAutoritéInstructrice';
import { délaiNotificationTemplateId } from '../constant';
import { DélaiNotificationsProps } from '../type';

export const handleDélaiDemandé = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: DélaiNotificationsProps<Lauréat.Délai.DélaiDemandéEvent>) => {
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
    templateId: délaiNotificationTemplateId.demander,
    messageSubject: `Potentiel - Demande de délai pour le projet ${projet.nom} situé dans le département ${projet.département}`,
    recipients,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Délai.détail(identifiantProjet.formatter(), event.payload.demandéLe)}`,
    },
  });
};
