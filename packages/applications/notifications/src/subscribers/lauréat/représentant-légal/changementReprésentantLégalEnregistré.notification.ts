import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients } from '../../../helpers';

import { RegisterReprésentantLégalNotificationDependencies } from '.';

import { représentantLégalNotificationTemplateId } from './constant';

type ChangementReprésentantLégalEnregistréNotificationProps = {
  sendEmail: RegisterReprésentantLégalNotificationDependencies['sendEmail'];
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalEnregistréEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
  };
  baseUrl: string;
};

export const changementReprésentantLégalEnregistréNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: ChangementReprésentantLégalEnregistréNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  if (dreals.length === 0) {
    getLogger().info('Aucune dreal trouvée', {
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
      url: `${baseUrl}${Routes.ReprésentantLégal.changement.détails(identifiantProjet.formatter(), event.payload.enregistréLe)}`,
    },
  });
};
