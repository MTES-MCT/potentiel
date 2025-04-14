import { IdentifiantProjet } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { listerDrealsRecipients } from '../../../helpers/listerDrealsRecipients';

import { RegisterReprésentantLégalNotificationDependencies } from '.';

type ChangementReprésentantLégalDemandéNotificationProps = {
  sendEmail: RegisterReprésentantLégalNotificationDependencies['sendEmail'];
  event: ReprésentantLégal.ChangementReprésentantLégalDemandéEvent;
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
    getLogger().error('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementReprésentantLégalDemandéNotification',
    });
    return;
  }

  return sendEmail({
    templateId: 6553655,
    messageSubject: `Potentiel - Demande de modification du représentant légal pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.ReprésentantLégal.changement.détail(identifiantProjet.formatter(), event.payload.demandéLe)}`,
    },
  });
};
