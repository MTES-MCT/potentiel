import { IdentifiantProjet } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { Actionnaire } from '@potentiel-domain/laureat';

import { listerPorteursRecipients } from '../../../helpers/listerPorteursRecipients';

import { RegisterActionnaireNotificationDependencies } from '.';

import { actionnaireNotificationTemplateId } from './constant';

type changementActionnaireRejetéNotificationsProps = {
  sendEmail: RegisterActionnaireNotificationDependencies['sendEmail'];
  event: Actionnaire.ChangementActionnaireRejetéEvent;
  projet: {
    nom: string;
    département: string;
  };
  baseUrl: string;
};

export const changementActionnaireRejetéNotifications = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: changementActionnaireRejetéNotificationsProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (porteurs.length === 0) {
    getLogger().error('Aucun porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
    });
    return;
  }

  await sendEmail({
    templateId: actionnaireNotificationTemplateId.changement.rejeter,
    messageSubject: `Potentiel - La demande de changement d'actionnaire pour le projet ${projet.nom} dans le département ${projet.département} a été rejetée`,
    recipients: porteurs,
    variables: {
      type: 'rejet',
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
    },
  });
};
