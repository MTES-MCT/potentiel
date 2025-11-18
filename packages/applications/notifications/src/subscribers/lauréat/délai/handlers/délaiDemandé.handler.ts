import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { listerRecipientsAutoritéInstructrice } from '#helpers';

import { délaiNotificationTemplateId } from '../constant.js';
import { DélaiNotificationsProps } from '../type.js';

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
