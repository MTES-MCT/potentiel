import { IdentifiantProjet } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Actionnaire } from '@potentiel-domain/laureat';

import { listerDrealsRecipients } from '../../../helpers/listerDrealsRecipients';
import { listerPorteursRecipients } from '../../../helpers/listerPorteursRecipients';

import { RegisterActionnaireNotificationDependencies } from '.';

import { actionnaireNotificationTemplateId } from './constant';

type ChangementActionnaireEnregistréNotificationsProps = {
  sendEmail: RegisterActionnaireNotificationDependencies['sendEmail'];
  event: Actionnaire.ChangementActionnaireEnregistréEvent;
  projet: {
    nom: string;
    région: string;
    département: string;
    url: string;
  };
};

export const changementActionnaireEnregistréNotifications = async ({
  sendEmail,
  event,
  projet,
}: ChangementActionnaireEnregistréNotificationsProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (dreals.length === 0 && porteurs.length === 0) {
    getLogger().error('Aucune dreal ou porteur trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementActionnaireEnregistréNotifications',
    });
    return;
  }

  await sendEmail({
    templateId: actionnaireNotificationTemplateId.changement.enregistrer,
    messageSubject: `Potentiel - Enregistrement d'un changement d'actionnaire pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });

  await sendEmail({
    templateId: actionnaireNotificationTemplateId.changement.enregistrer,
    messageSubject: `Potentiel - Enregistrement d'un changement d'actionnaire pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
