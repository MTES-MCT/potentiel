import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients } from '../../../_helpers';

import { RegisterActionnaireNotificationDependencies } from '.';

import { actionnaireNotificationTemplateId } from './constant';

type ChangementActionnaireAnnuléNotificationsProps = {
  sendEmail: RegisterActionnaireNotificationDependencies['sendEmail'];
  event: Lauréat.Actionnaire.ChangementActionnaireAnnuléEvent;
  projet: {
    nom: string;
    région: string;
    département: string;
    url: string;
  };
};

export const changementActionnaireAnnuléNotifications = async ({
  sendEmail,
  event,
  projet,
}: ChangementActionnaireAnnuléNotificationsProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  if (dreals.length === 0) {
    getLogger().info('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementActionnaireAnnuléNotifications',
    });
    return;
  }

  await sendEmail({
    templateId: actionnaireNotificationTemplateId.changement.annuler,
    messageSubject: `Potentiel - La demande de changement d'actionnaire pour le projet ${projet.nom} dans le département ${projet.département} a été annulée`,
    recipients: dreals,
    variables: {
      type: 'annulation',
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
