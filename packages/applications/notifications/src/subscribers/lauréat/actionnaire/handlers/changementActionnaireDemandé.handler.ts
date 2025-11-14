import { listerDrealsRecipients } from '@/helpers';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { actionnaireNotificationTemplateId } from '../constant';
import { ActionnaireNotificationsProps } from '../type';

export const handleChangementActionnaireDemandé = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: ActionnaireNotificationsProps<Lauréat.Actionnaire.ChangementActionnaireDemandéEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  if (dreals.length === 0) {
    getLogger().info('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
    });
    return;
  }

  return sendEmail({
    templateId: actionnaireNotificationTemplateId.changement.demander,
    messageSubject: `Potentiel - Demande de changement de l'actionnaire pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Actionnaire.changement.détails(identifiantProjet.formatter(), event.payload.demandéLe)}`,
    },
  });
};
