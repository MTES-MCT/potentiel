import { IdentifiantProjet } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { Actionnaire } from '@potentiel-domain/laureat';

import { listerDrealsRecipients } from '../../../helpers/listerDrealsRecipients';

import { RegisterActionnaireNotificationDependencies } from '.';

import { actionnaireNotificationTemplateId } from './templateIds';

type changementActionnaireDemandéNotificationsProps = {
  sendEmail: RegisterActionnaireNotificationDependencies['sendEmail'];
  event: Actionnaire.ChangementActionnaireDemandéEvent;
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
    getLogger().error('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementActionnaireDemandéNotifications',
    });
    return;
  }

  return sendEmail({
    templateId: actionnaireNotificationTemplateId.demanderChangement,
    messageSubject: `Potentiel - Demande de changement de l'actionnaire pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Actionnaire.changement.détails(identifiantProjet.formatter(), event.payload.demandéLe)}`,
    },
  });
};
