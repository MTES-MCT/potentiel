import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { RegisterPuissanceNotificationDependencies } from '..';
import { listerDgecRecipients, listerDrealsRecipients } from '../../../../_helpers';
import { Recipient } from '../../../../sendEmail';
import { puissanceNotificationTemplateId } from '../constant';

type ChangementPuissanceDemandéNotificationProps = {
  sendEmail: RegisterPuissanceNotificationDependencies['sendEmail'];
  event: Lauréat.Puissance.ChangementPuissanceDemandéEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
  };
  baseUrl: string;
};

export const changementPuissanceDemandéNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: ChangementPuissanceDemandéNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  const recipients: Array<Recipient> = [...dreals];

  if (event.payload.autoritéCompétente === 'dgec-admin') {
    const dgecs = await listerDgecRecipients(identifiantProjet);

    recipients.push(...dgecs);
  }

  if (recipients.length === 0) {
    getLogger().info('Aucune dreal ou DGEC trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'demandeChangementPuissanceDemandéNotification',
    });
    return;
  }

  return sendEmail({
    templateId: puissanceNotificationTemplateId.changement.demander,
    messageSubject: `Potentiel - Demande de changement de puissance pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Puissance.changement.détails(identifiantProjet.formatter(), event.payload.demandéLe)}`,
    },
  });
};
