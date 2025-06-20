import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerPorteursRecipients } from '../../../helpers';

import { RegisterActionnaireNotificationDependencies } from '.';

import { actionnaireNotificationTemplateId } from './constant';

type ChangementActionnaireAccordéNotificationsProps = {
  sendEmail: RegisterActionnaireNotificationDependencies['sendEmail'];
  event: Lauréat.Actionnaire.ChangementActionnaireAccordéEvent;
  projet: {
    nom: string;
    département: string;
    url: string;
  };
};

export const changementActionnaireAccordéNotifications = async ({
  sendEmail,
  event,
  projet,
}: ChangementActionnaireAccordéNotificationsProps) => {
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
    templateId: actionnaireNotificationTemplateId.changement.accorder,
    messageSubject: `Potentiel - La demande de changement d'actionnaire pour le projet ${projet.nom} dans le département ${projet.département} a été accordée`,
    recipients: porteurs,
    variables: {
      type: 'accord',
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
