import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerPorteursRecipients } from '#helpers';
import { SendEmail } from '#sendEmail';

import { représentantLégalNotificationTemplateId } from '../constant.js';

type ReprésentantLégalModifiéNotificationProps = {
  sendEmail: SendEmail;
  event: Lauréat.ReprésentantLégal.ReprésentantLégalModifiéEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
    url: string;
  };
};

export const représentantLégalModifiéNotification = async ({
  sendEmail,
  event,
  projet,
}: ReprésentantLégalModifiéNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (porteurs.length === 0) {
    getLogger().error('Aucun porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'représentantLégalModifiéNotification',
    });
    return;
  }

  return sendEmail({
    templateId: représentantLégalNotificationTemplateId.modifier,
    messageSubject: `Potentiel - Modification du représentant légal pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
