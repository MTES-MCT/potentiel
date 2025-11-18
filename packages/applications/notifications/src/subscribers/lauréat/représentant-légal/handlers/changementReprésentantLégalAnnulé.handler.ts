import { Lauréat } from '@potentiel-domain/projet';

import { listerDrealsRecipients } from '#helpers';
import { SendEmail } from '#sendEmail';

import { représentantLégalNotificationTemplateId } from '../constant.js';

type ChangementReprésentantLégalAnnuléNotificationProps = {
  sendEmail: SendEmail;
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalAnnuléEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
    url: string;
  };
};

export const changementReprésentantLégalAnnuléNotification = async ({
  sendEmail,
  projet,
}: ChangementReprésentantLégalAnnuléNotificationProps) => {
  const dreals = await listerDrealsRecipients(projet.région);

  return sendEmail({
    templateId: représentantLégalNotificationTemplateId.changement.annuler,
    messageSubject: `Potentiel - Annulation de la demande de modification du représentant légal pour le projet ${projet.nom} situé dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
