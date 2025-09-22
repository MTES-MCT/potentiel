import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, listerPorteursRecipients } from '../../../helpers';
import { listerRecipientsAutoritéInstructrice } from '../../../helpers/listerRecipientsAutoritéInstructrice';

import { AbandonNotificationsProps } from './type';
import { abandonNotificationTemplateId } from './constant';

export const abandonDemandéNotifications = async ({
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
    messageSubject: `Potentiel - Abandon demandé pour le projet ${projet.nom} (${appelOffre} période ${période})`,
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
