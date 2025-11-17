import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import {
  getBaseUrl,
  listerPorteursRecipients,
  listerRecipientsAutoritéInstructrice,
} from '#helpers';

import { abandonNotificationTemplateId } from '../constant.js';
import { AbandonNotificationsProps } from '../type.js';

export const handleAbandonConfirmé = async ({
  sendEmail,
  event,
  projet,
}: AbandonNotificationsProps<Lauréat.Abandon.AbandonConfirméEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const { appelOffre, période } = identifiantProjet;
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const adminRecipients = await listerRecipientsAutoritéInstructrice({
    identifiantProjet,
    région: projet.région,
    domain: 'abandon',
  });

  await sendEmail({
    templateId: abandonNotificationTemplateId.confirmer,
    messageSubject: `Potentiel - Demande d'abandon confirmée pour le projet ${projet.nom} (${appelOffre} période ${période})`,
    recipients: porteurs,
    bcc: adminRecipients,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      nouveau_statut: 'confirmée',
      abandon_url: `${getBaseUrl()}${Routes.Abandon.détail(identifiantProjet.formatter())}`,
    },
  });
};
