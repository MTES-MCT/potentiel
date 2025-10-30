import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { RegisterPuissanceNotificationDependencies } from '..';
import { listerDrealsRecipients, listerPorteursRecipients } from '../../../../_helpers';
import { puissanceNotificationTemplateId } from '../constant';

type ChangementPuissanceEnregistréNotificationProps = {
  sendEmail: RegisterPuissanceNotificationDependencies['sendEmail'];
  event: Lauréat.Puissance.ChangementPuissanceEnregistréEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
    url: string;
  };
};

export const changementPuissanceEnregistréNotification = async ({
  sendEmail,
  event,
  projet,
}: ChangementPuissanceEnregistréNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (dreals.length === 0 && porteurs.length === 0) {
    getLogger().info('Aucune dreal ou porteur trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementPuissanceEnregistréNotifications',
    });
    return;
  }

  await sendEmail({
    templateId: puissanceNotificationTemplateId.changement.enregistrer,
    messageSubject: `Potentiel - Déclaration de changement de puissance pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });

  await sendEmail({
    templateId: puissanceNotificationTemplateId.changement.enregistrer,
    messageSubject: `Potentiel - Déclaration de changement de puissance pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
