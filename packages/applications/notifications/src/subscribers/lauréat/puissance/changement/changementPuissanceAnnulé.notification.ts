import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { RegisterPuissanceNotificationDependencies } from '..';
import { listerDgecRecipients, listerDrealsRecipients } from '../../../../_helpers';
import { Recipient } from '../../../../sendEmail';
import { puissanceNotificationTemplateId } from '../constant';

type ChangementPuissanceAnnuléNotificationProps = {
  sendEmail: RegisterPuissanceNotificationDependencies['sendEmail'];
  event: Lauréat.Puissance.ChangementPuissanceAnnuléEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
    url: string;
  };
};

export const changementPuissanceAnnuléNotification = async ({
  sendEmail,
  event,
  projet,
}: ChangementPuissanceAnnuléNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  const recipients: Array<Recipient> = [...dreals];

  if (event.payload.autoritéCompétente === 'dgec-admin') {
    const dgecs = await listerDgecRecipients(identifiantProjet);

    recipients.push(...dgecs);
  }

  if (dreals.length === 0) {
    getLogger().info('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'demandeChangementPuissanceAnnuléeNotification',
    });
    return;
  }

  return sendEmail({
    templateId: puissanceNotificationTemplateId.changement.annuler,
    messageSubject: `Potentiel - La demande de changement de puissance pour le projet ${projet.nom} dans le département ${projet.département} a été annulée`,
    recipients,
    variables: {
      type: 'annulation',
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
