import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { listerDrealsRecipients, listerPorteursRecipients } from '#helpers';

import { actionnaireNotificationTemplateId } from '../constant.js';
import { ActionnaireNotificationsProps } from '../type.js';

export const handleActionnaireModifié = async ({
  sendEmail,
  event,
  projet,
}: ActionnaireNotificationsProps<Lauréat.Actionnaire.ActionnaireModifiéEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  await sendEmail({
    templateId: actionnaireNotificationTemplateId.modifier,
    messageSubject: `Potentiel - Modification de l'actionnaire pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });

  await sendEmail({
    templateId: actionnaireNotificationTemplateId.modifier,
    messageSubject: `Potentiel - Modification de l'actionnaire pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
