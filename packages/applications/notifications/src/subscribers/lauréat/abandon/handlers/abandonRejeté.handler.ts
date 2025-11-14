import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { getBaseUrl, listerPorteursRecipients } from '@/helpers';

import { abandonNotificationTemplateId } from '../constant.js';
import { AbandonNotificationsProps } from '../type.js';

export const handleAbandonRejeté = async ({
  sendEmail,
  event,
  projet,
}: AbandonNotificationsProps<Lauréat.Abandon.AbandonRejetéEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const { appelOffre, période } = identifiantProjet;
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  await sendEmail({
    templateId: abandonNotificationTemplateId.rejeter,
    messageSubject: `Potentiel - Demande d'abandon rejetée pour le projet ${projet.nom} (${appelOffre} période ${période})`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      nouveau_statut: 'rejetée',
      abandon_url: `${getBaseUrl()}${Routes.Abandon.détail(identifiantProjet.formatter())}`,
    },
  });
};
