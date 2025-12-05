import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getAppelOffre, getBaseUrl, listerPorteursRecipients } from '#helpers';

import { abandonNotificationTemplateId } from '../constant.js';
import { AbandonNotificationsProps } from '../type.js';

export const handleConfirmationAbandonDemandée = async ({
  sendEmail,
  event,
  projet,
}: AbandonNotificationsProps<Lauréat.Abandon.ConfirmationAbandonDemandéeEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const { période } = identifiantProjet;
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const appelOffres = await getAppelOffre(identifiantProjet.appelOffre);

  await sendEmail({
    templateId: abandonNotificationTemplateId.demanderConfirmation,
    messageSubject: `Potentiel - Demande d'abandon en attente de confirmation pour le projet ${projet.nom} (${appelOffres.id} période ${période})`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      nouveau_statut: 'en attente de confirmation',
      abandon_url: `${getBaseUrl()}${Routes.Abandon.détailRedirection(identifiantProjet.formatter())}`,
    },
  });
};
