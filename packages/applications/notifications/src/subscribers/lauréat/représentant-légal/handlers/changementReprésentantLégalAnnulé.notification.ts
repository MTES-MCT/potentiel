import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients } from '../../../../_helpers';
import { RegisterReprésentantLégalNotificationDependencies } from '..';
import { représentantLégalNotificationTemplateId } from '../constant';

type ChangementReprésentantLégalAnnuléNotificationProps = {
  sendEmail: RegisterReprésentantLégalNotificationDependencies['sendEmail'];
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
  event,
  projet,
}: ChangementReprésentantLégalAnnuléNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  if (dreals.length === 0) {
    getLogger().info('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementReprésentantLégalAnnuléNotification',
    });
    return;
  }

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
