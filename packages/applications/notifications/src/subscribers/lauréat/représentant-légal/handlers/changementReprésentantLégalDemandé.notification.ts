import { listerDrealsRecipients } from '@/helpers';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { RegisterReprésentantLégalNotificationDependencies } from '..';
import { représentantLégalNotificationTemplateId } from '../constant';

type ChangementReprésentantLégalDemandéNotificationProps = {
  sendEmail: RegisterReprésentantLégalNotificationDependencies['sendEmail'];
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalDemandéEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
  };
  baseUrl: string;
};

export const changementReprésentantLégalDemandéNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: ChangementReprésentantLégalDemandéNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  if (dreals.length === 0) {
    getLogger().info('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementReprésentantLégalDemandéNotification',
    });
    return;
  }

  return sendEmail({
    templateId: représentantLégalNotificationTemplateId.changement.demander,
    messageSubject: `Potentiel - Demande de modification du représentant légal pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.ReprésentantLégal.changement.détails(identifiantProjet.formatter(), event.payload.demandéLe)}`,
    },
  });
};
