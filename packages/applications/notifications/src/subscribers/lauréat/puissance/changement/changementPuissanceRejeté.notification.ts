import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { Puissance } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { RegisterPuissanceNotificationDependencies } from '..';
import { listerPorteursRecipients } from '../../../../helpers/listerPorteursRecipients';

type ChangementPuissanceRejetéNotificationProps = {
  sendEmail: RegisterPuissanceNotificationDependencies['sendEmail'];
  event: Puissance.ChangementPuissanceRejetéEvent;
  projet: {
    nom: string;
    département: string;
  };
  baseUrl: string;
};

export const changementPuissanceRejetéNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: ChangementPuissanceRejetéNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (porteurs.length === 0) {
    getLogger().error('Aucun porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementPuissanceRejetéNotification',
    });
    return;
  }

  return sendEmail({
    templateId: 6873755,
    messageSubject: `Potentiel - La demande de changement de puissance pour le projet ${projet.nom} dans le département ${projet.département} a été rejetée`,
    recipients: porteurs,
    variables: {
      type: 'rejet',
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
    },
  });
};
