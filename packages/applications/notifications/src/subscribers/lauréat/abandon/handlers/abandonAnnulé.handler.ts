import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import {
  getBaseUrl,
  listerPorteursRecipients,
  listerRecipientsAutoritéInstructrice,
} from '#helpers';

import { abandonNotificationTemplateId } from '../constant.js';
import { AbandonNotificationsProps } from '../type.js';

export const handleAbandonAnnulé = async ({
  sendEmail,
  event,
  projet,
}: AbandonNotificationsProps<Lauréat.Abandon.AbandonAnnuléEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const { appelOffre, période } = identifiantProjet;
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  const adminRecipients = await listerRecipientsAutoritéInstructrice({
    identifiantProjet,
    région: projet.région,
    domain: 'abandon',
  });

  await sendEmail({
    templateId: abandonNotificationTemplateId.annuler,
    messageSubject: `Potentiel - Demande d'abandon annulée pour le projet ${projet.nom} (${appelOffre} période ${période})`,
    recipients: porteurs,
    bcc: adminRecipients,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      nouveau_statut: 'annulée',
      abandon_url: `${getBaseUrl()}${Routes.Abandon.détailRedirection(identifiantProjet.formatter())}`,
    },
  });
};
