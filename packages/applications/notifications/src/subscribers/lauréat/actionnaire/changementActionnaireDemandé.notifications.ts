import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients } from '../../../_helpers';

import { RegisterActionnaireNotificationDependencies } from '.';

import { actionnaireNotificationTemplateId } from './constant';

type changementActionnaireDemandéNotificationsProps = {
  sendEmail: RegisterActionnaireNotificationDependencies['sendEmail'];
  event: Lauréat.Actionnaire.ChangementActionnaireDemandéEvent;
  projet: {
    nom: string;
    région: string;
    département: string;
  };
  baseUrl: string;
};

export const changementActionnaireDemandéNotifications = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: changementActionnaireDemandéNotificationsProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  if (dreals.length === 0) {
    getLogger().info('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementActionnaireDemandéNotifications',
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
