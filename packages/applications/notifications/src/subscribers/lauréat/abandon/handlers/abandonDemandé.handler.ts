import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import {
  getBaseUrl,
  listerPorteursRecipients,
  listerRecipientsAutoritéInstructrice,
} from '#helpers';

import { AbandonNotificationsProps } from '../type.js';
import { abandonNotificationTemplateId } from '../constant.js';

export const handleAbandonDemandé = async ({
  sendEmail,
  event,
  projet,
}: AbandonNotificationsProps<
  Lauréat.Abandon.AbandonDemandéEvent | Lauréat.Abandon.AbandonDemandéEventV1
>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const { appelOffre, période } = identifiantProjet;
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const adminRecipients = await listerRecipientsAutoritéInstructrice({
    identifiantProjet,
    région: projet.région,
    domain: 'abandon',
  });

  await sendEmail({
    templateId: abandonNotificationTemplateId.demander,
    messageSubject: `Potentiel - Nouvelle demande d'abandon pour le projet ${projet.nom} (${appelOffre} période ${période})`,
    recipients: porteurs,
    bcc: adminRecipients,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      nouveau_statut: 'envoyée',
      abandon_url: `${getBaseUrl()}${Routes.Abandon.détail(identifiantProjet.formatter())}`,
    },
  });
};
