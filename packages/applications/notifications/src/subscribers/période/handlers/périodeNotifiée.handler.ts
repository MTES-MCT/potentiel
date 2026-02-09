import { Période } from '@potentiel-domain/periode';

import { getBaseUrl, NotificationHandlerProps } from '#helpers';

import { périodeNotificationTemplateId } from '../constant.js';
import { listerRecipients } from '../../../helpers/listerRecipients.js';

export const handlePériodeNotifiée = async ({
  event,
  sendEmail,
}: NotificationHandlerProps<Période.PériodeNotifiéeEvent>) => {
  const identifiantPériode = Période.IdentifiantPériode.convertirEnValueType(
    event.payload.identifiantPériode,
  );

  const usersOthersThanDGECOrPorteur = await listerRecipients({
    roles: [
      'admin',
      'dreal',
      'cocontractant',
      'ademe',
      'dgec-validateur',
      'caisse-des-dépôts',
      'cre',
    ],
  });

  const baseUrl = getBaseUrl();

  for (const { email } of usersOthersThanDGECOrPorteur) {
    await sendEmail({
      templateId: périodeNotificationTemplateId.notifierDrealCocontractantAdemeCaisseDesDépôtsCRE,
      recipients: [{ email }],
      messageSubject: `Potentiel - Notification de la période ${identifiantPériode.période} de l'appel d'offres ${identifiantPériode.appelOffre}`,
      variables: {
        appel_offre: identifiantPériode.appelOffre,
        periode: identifiantPériode.période,
        date_notification: new Date(event.payload.notifiéeLe).toLocaleDateString('fr-FR'),
        redirect_url: baseUrl,
      },
    });
  }
};
