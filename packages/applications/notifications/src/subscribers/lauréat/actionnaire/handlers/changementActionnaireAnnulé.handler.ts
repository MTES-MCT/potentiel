import { Lauréat } from '@potentiel-domain/projet';

import { listerDrealsRecipients } from '#helpers';

import { actionnaireNotificationTemplateId } from '../constant.js';
import { ActionnaireNotificationsProps } from '../type.js';

export const handleChangementActionnaireAnnulé = async ({
  sendEmail,
  projet,
}: ActionnaireNotificationsProps<Lauréat.Actionnaire.ChangementActionnaireAnnuléEvent>) => {
  const dreals = await listerDrealsRecipients(projet.région);

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
