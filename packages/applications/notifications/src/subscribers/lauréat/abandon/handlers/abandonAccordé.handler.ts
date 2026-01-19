import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import {
  getBaseUrl,
  listerCocontractantRecipients,
  listerCreRecipients,
  listerDrealsRecipients,
  listerPorteursRecipients,
} from '#helpers';

import { abandonNotificationTemplateId } from '../constant.js';
import { AbandonNotificationsProps } from '../type.js';

export const handleAbandonAccordé = async ({
  sendEmail,
  event,
  projet,
}: AbandonNotificationsProps<Lauréat.Abandon.AbandonAccordéEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const { appelOffre, période } = identifiantProjet;
  const porteursRecipients = await listerPorteursRecipients(identifiantProjet);
  const creRecipients = await listerCreRecipients();
  const drealRecipients = await listerDrealsRecipients(projet.région);
  const cocontractantsRecipients = await listerCocontractantRecipients(projet.région);

  await sendEmail({
    templateId: abandonNotificationTemplateId.accorder,
    messageSubject: `Potentiel - Demande d'abandon accordée pour le projet ${projet.nom} (${appelOffre} période ${période})`,
    recipients: porteursRecipients,
    bcc: [...drealRecipients, ...creRecipients, ...cocontractantsRecipients],
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      nouveau_statut: 'accordée',
      abandon_url: `${getBaseUrl()}${Routes.Abandon.détailRedirection(identifiantProjet.formatter())}`,
    },
  });
};
