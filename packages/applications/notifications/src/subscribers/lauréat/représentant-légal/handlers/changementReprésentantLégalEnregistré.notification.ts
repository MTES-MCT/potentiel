import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients, listerPorteursRecipients } from '../../../../_helpers';
import { RegisterReprésentantLégalNotificationDependencies } from '..';
import { représentantLégalNotificationTemplateId } from '../constant';

type ChangementReprésentantLégalEnregistréNotificationProps = {
  sendEmail: RegisterReprésentantLégalNotificationDependencies['sendEmail'];
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

  if (dreals.length === 0 && porteurs.length === 0) {
    getLogger().info('Aucun porteur ou dreal trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementReprésentantLégalEnregistréNotifications',
    });
    return;
  }

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
