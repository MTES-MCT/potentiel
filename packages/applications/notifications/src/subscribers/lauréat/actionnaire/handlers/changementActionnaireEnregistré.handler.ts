import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { listerDrealsRecipients, listerPorteursRecipients } from '#helpers';

import { RegisterActionnaireNotificationDependencies } from '../actionnaire.notifications.js';
import { actionnaireNotificationTemplateId } from '../constant.js';

type ChangementActionnaireEnregistréNotificationsProps = {
  sendEmail: RegisterActionnaireNotificationDependencies['sendEmail'];
  event: Lauréat.Actionnaire.ChangementActionnaireEnregistréEvent;
  projet: {
    nom: string;
    région: string;
    département: string;
    url: string;
  };
};

export const handleChangementActionnaireEnregistré = async ({
  sendEmail,
  event,
  projet,
}: ChangementActionnaireEnregistréNotificationsProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  await sendEmail({
    templateId: actionnaireNotificationTemplateId.changement.enregistrer,
    messageSubject: `Potentiel - Déclaration de changement d'actionnaire pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });

  await sendEmail({
    templateId: actionnaireNotificationTemplateId.changement.enregistrer,
    messageSubject: `Potentiel - Déclaration de changement d'actionnaire pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
