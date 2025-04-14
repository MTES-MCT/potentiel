import { IdentifiantProjet } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { Actionnaire } from '@potentiel-domain/laureat';

import { listerDrealsRecipients } from '../../../helpers/listerDrealsRecipients';

import { RegisterActionnaireNotificationDependencies } from '.';

import { actionnaireNotificationTemplateId } from './templateIds';

type ChangementActionnaireEnregistréNotificationsProps = {
  sendEmail: RegisterActionnaireNotificationDependencies['sendEmail'];
  event: Actionnaire.ChangementActionnaireEnregistréEvent;
  projet: {
    nom: string;
    région: string;
    département: string;
  };
  baseUrl: string;
};

export const changementActionnaireEnregistréNotifications = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: ChangementActionnaireEnregistréNotificationsProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  if (dreals.length === 0) {
    getLogger().error('Aucune dreal trouvé(e)', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementActionnaireEnregistréNotifications',
    });
    return;
  }

  await sendEmail({
    templateId: actionnaireNotificationTemplateId.modifier,
    messageSubject: `Potentiel - Enregistrement d'un changement d'actionnaire pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
    },
  });
};
