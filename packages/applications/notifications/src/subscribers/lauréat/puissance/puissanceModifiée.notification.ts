import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerPorteursRecipients } from '../../../_helpers';

import { RegisterPuissanceNotificationDependencies } from '.';

import { puissanceNotificationTemplateId } from './constant';

type PuissanceModifiéeNotificationProps = {
  sendEmail: RegisterPuissanceNotificationDependencies['sendEmail'];
  event: Lauréat.Puissance.PuissanceModifiéeEvent;
  projet: {
    nom: string;
    département: string;
    url: string;
  };
};

export const puissanceModifiéeNotification = async ({
  sendEmail,
  event,
  projet,
}: PuissanceModifiéeNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (porteurs.length === 0) {
    getLogger().error('Aucun porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'puissanceModifiéeNotification',
    });
    return;
  }

  return sendEmail({
    templateId: puissanceNotificationTemplateId.modifier,
    messageSubject: `Potentiel - Modification de la puissance du projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
