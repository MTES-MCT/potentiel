import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { Puissance } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { RegisterPuissanceNotificationDependencies } from '..';
import { listerDrealsRecipients } from '../../../../helpers/listerDrealsRecipients';
import { Recipient } from '../../../../sendEmail';
import { getDgecRecipient } from '../../../../helpers/getDgecRecipient';

type ChangementPuissanceAnnuléNotificationProps = {
  sendEmail: RegisterPuissanceNotificationDependencies['sendEmail'];
  event: Puissance.ChangementPuissanceAnnuléEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
  };
  baseUrl: string;
};

export const changementPuissanceAnnuléNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: ChangementPuissanceAnnuléNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  const recipients: Array<Recipient> = [...dreals];

  if (event.payload.autoritéCompétente === 'dgec-admin') {
    recipients.push(getDgecRecipient(identifiantProjet.appelOffre));
  }

  if (dreals.length === 0) {
    getLogger().error('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'demandeChangementPuissanceAnnuléeNotification',
    });
    return;
  }

  return sendEmail({
    templateId: 6887039,
    messageSubject: `Potentiel - La demande de changement de puissance pour le projet ${projet.nom} dans le département ${projet.département} a été annulée`,
    recipients,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
    },
  });
};
