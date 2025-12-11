import { mediator } from 'mediateur';

import { Période } from '@potentiel-domain/periode';
import { ListerUtilisateursQuery } from '@potentiel-domain/utilisateur';

import { getBaseUrl, NotificationHandlerProps } from '#helpers';

import { périodeNotificationTemplateId } from '../constant.js';

export const handlePériodeNotifiée = async ({
  event,
  sendEmail,
}: NotificationHandlerProps<Période.PériodeNotifiéeEvent>) => {
  const identifiantPériode = Période.IdentifiantPériode.convertirEnValueType(
    event.payload.identifiantPériode,
  );

  const usersOthersThanDGECOrPorteur = await mediator.send<ListerUtilisateursQuery>({
    type: 'Utilisateur.Query.ListerUtilisateurs',
    data: {
      roles: [
        'admin',
        'dreal',
        'cocontractant',
        'ademe',
        'dgec-validateur',
        'caisse-des-dépôts',
        'cre',
      ],
      actif: true,
    },
  });

  const baseUrl = getBaseUrl();

  for (const { email } of usersOthersThanDGECOrPorteur.items) {
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
