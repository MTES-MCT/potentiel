import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { getBaseUrl, listerPorteursRecipients } from '../../../helpers';

import { abandonNotificationTemplateId } from './constant';
import { AbandonNotificationsProps } from './type';

export const abandonPasséEnInstructionNotifications = async ({
  sendEmail,
  event,
  projet,
}: AbandonNotificationsProps<Lauréat.Abandon.AbandonPasséEnInstructionEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  await sendEmail({
    templateId: abandonNotificationTemplateId.passerEnInstruction,
    messageSubject: `Potentiel - La demande d'abandon pour le projet ${projet.nom} est en instruction`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      nouveau_statut: 'en instruction',
      abandon_url: `${getBaseUrl()}${Routes.Abandon.détail(identifiantProjet.formatter())}`,
    },
  });
};
