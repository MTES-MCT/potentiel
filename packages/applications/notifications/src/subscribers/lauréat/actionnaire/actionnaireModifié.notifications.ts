import { Actionnaire } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients, listerPorteursRecipients } from '../../../helpers';

import { RegisterActionnaireNotificationDependencies } from '.';

import { actionnaireNotificationTemplateId } from './constant';

type ActionnaireModifiéNotificationsProps = {
  sendEmail: RegisterActionnaireNotificationDependencies['sendEmail'];
  event: Actionnaire.ActionnaireModifiéEvent;
  projet: {
    nom: string;
    région: string;
    département: string;
    url: string;
  };
};

export const actionnaireModifiéNotifications = async ({
  sendEmail,
  event,
  projet,
}: ActionnaireModifiéNotificationsProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  if (porteurs.length === 0 && dreals.length === 0) {
    getLogger().error('Aucun porteur ou dreal trouvé(e)', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'actionnaireModifié.notifications.ts',
    });
    return;
  }

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
