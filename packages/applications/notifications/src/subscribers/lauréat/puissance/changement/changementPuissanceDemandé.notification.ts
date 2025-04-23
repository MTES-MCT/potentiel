import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { Puissance } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { RegisterPuissanceNotificationDependencies } from '..';
import { Recipient } from '../../../../sendEmail';
import { listerDrealsRecipients } from '../../../../helpers/listerDrealsRecipients';
import { listerDgecRecipients } from '../../../../helpers/listerDgecRecipients';
import { puissanceNotificationTemplateId } from '../constant';

type ChangementPuissanceDemandéNotificationProps = {
  sendEmail: RegisterPuissanceNotificationDependencies['sendEmail'];
  event: Puissance.ChangementPuissanceDemandéEvent;
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
    getLogger().error('Aucune dreal ou DGEC trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'demandeChangementPuissanceAnnuléeNotification',
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
