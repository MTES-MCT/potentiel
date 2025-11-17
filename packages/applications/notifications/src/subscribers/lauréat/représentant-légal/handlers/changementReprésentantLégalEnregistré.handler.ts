import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { listerDrealsRecipients, listerPorteursRecipients } from '#helpers';
import { SendEmail } from '#sendEmail';

import { représentantLégalNotificationTemplateId } from '../constant.js';

type ChangementReprésentantLégalEnregistréNotificationProps = {
  sendEmail: SendEmail;
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalEnregistréEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
    url: string;
  };
};

export const changementReprésentantLégalEnregistréNotification = async ({
  sendEmail,
  event,
  projet,
}: ChangementReprésentantLégalEnregistréNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  await sendEmail({
    templateId: représentantLégalNotificationTemplateId.changement.enregistrer,
    messageSubject: `Potentiel - Déclaration de changement de représentant légal pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });

  await sendEmail({
    templateId: représentantLégalNotificationTemplateId.changement.enregistrer,
    messageSubject: `Potentiel - Déclaration de changement de représentant légal pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
