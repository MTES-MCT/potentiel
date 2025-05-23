import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { RegisterPuissanceNotificationDependencies } from '..';
import { listerPorteursRecipients } from '../../../../helpers/listerPorteursRecipients';
import { puissanceNotificationTemplateId } from '../constant';

type ChangementPuissanceAccordéNotificationProps = {
  sendEmail: RegisterPuissanceNotificationDependencies['sendEmail'];
  event: Lauréat.Puissance.ChangementPuissanceAccordéEvent;
  projet: {
    nom: string;
    département: string;
  };
  baseUrl: string;
};

export const changementPuissanceAccordéNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: ChangementPuissanceAccordéNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (porteurs.length === 0) {
    getLogger().error('Aucun porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementPuissanceAccordéNotification',
    });
    return;
  }

  return sendEmail({
    templateId: puissanceNotificationTemplateId.changement.accorder,
    messageSubject: `Potentiel - La demande de changement de puissance pour le projet ${projet.nom} dans le département ${projet.département} a été accordée`,
    recipients: porteurs,
    variables: {
      type: 'accord',
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
    },
  });
};
