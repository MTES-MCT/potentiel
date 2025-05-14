import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { Puissance } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { RegisterPuissanceNotificationDependencies } from '..';
import { listerDrealsRecipients } from '../../../../helpers/listerDrealsRecipients';
import { puissanceNotificationTemplateId } from '../constant';
import { listerPorteursRecipients } from '../../../../helpers/listerPorteursRecipients';

type ChangementPuissanceEnregistréNotificationProps = {
  sendEmail: RegisterPuissanceNotificationDependencies['sendEmail'];
  event: Puissance.ChangementPuissanceEnregistréEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
  };
  baseUrl: string;
};

export const changementPuissanceEnregistréNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: ChangementPuissanceEnregistréNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (dreals.length === 0 && porteurs.length === 0) {
    getLogger().error('Aucune dreal ou porteur trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementPuissanceEnregistréNotifications',
    });
    return;
  }

  await sendEmail({
    templateId: puissanceNotificationTemplateId.changement.enregistrer,
    messageSubject: `Potentiel - Enregistrement d'un changement de puissance pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
    },
  });

  await sendEmail({
    templateId: puissanceNotificationTemplateId.changement.enregistrer,
    messageSubject: `Potentiel - Enregistrement d'un changement de puissance pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
    },
  });
};
