import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { RegisterPuissanceNotificationDependencies } from '..';
import { listerPorteursRecipients } from '../../../../_helpers';
import { puissanceNotificationTemplateId } from '../constant';

type ChangementPuissanceRejetéNotificationProps = {
  sendEmail: RegisterPuissanceNotificationDependencies['sendEmail'];
  event: Lauréat.Puissance.ChangementPuissanceRejetéEvent;
  projet: {
    nom: string;
    département: string;
    url: string;
  };
};

export const changementPuissanceRejetéNotification = async ({
  sendEmail,
  event,
  projet,
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
    templateId: puissanceNotificationTemplateId.changement.rejeter,
    messageSubject: `Potentiel - La demande de changement de puissance pour le projet ${projet.nom} dans le département ${projet.département} a été rejetée`,
    recipients: porteurs,
    variables: {
      type: 'rejet',
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
