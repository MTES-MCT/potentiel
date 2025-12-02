import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { listerPorteursRecipients } from '#helpers';

import { abandonNotificationTemplateId } from '../constant.js';
import { AbandonNotificationsProps } from '../type.js';

export const handleAbandonAccordé = async ({
  sendEmail,
  event,
  projet,
}: AbandonNotificationsProps<Lauréat.Abandon.AbandonAccordéEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const { appelOffre, période } = identifiantProjet;
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  await sendEmail({
    templateId: abandonNotificationTemplateId.accorder,
    messageSubject: `Potentiel - Demande d'abandon accordée pour le projet ${projet.nom} (${appelOffre} période ${période})`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      nouveau_statut: 'accordée',
      abandon_url: projet.url,
    },
  });
};
