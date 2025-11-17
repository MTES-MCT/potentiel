import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { listerPorteursRecipients } from '#helpers';

import { RegisterActionnaireNotificationDependencies } from '../actionnaire.notifications.js';
import { actionnaireNotificationTemplateId } from '../constant.js';

type changementActionnaireRejetéNotificationsProps = {
  sendEmail: RegisterActionnaireNotificationDependencies['sendEmail'];
  event: Lauréat.Actionnaire.ChangementActionnaireRejetéEvent;
  projet: {
    nom: string;
    département: string;
    url: string;
  };
};

export const handleChangementActionnaireRejeté = async ({
  sendEmail,
  event,
  projet,
}: changementActionnaireRejetéNotificationsProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  await sendEmail({
    templateId: actionnaireNotificationTemplateId.changement.rejeter,
    messageSubject: `Potentiel - La demande de changement d'actionnaire pour le projet ${projet.nom} dans le département ${projet.département} a été rejetée`,
    recipients: porteurs,
    variables: {
      type: 'rejet',
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
