import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients, listerPorteursRecipients } from '../../../_helpers';

import { lauréatNotificationTemplateId } from './constant';
import { RegisterLauréatNotificationDependencies } from './lauréat.notifications';

type ChangementNomProjetEnregistréNotificationProps = {
  sendEmail: RegisterLauréatNotificationDependencies['sendEmail'];
  event: Lauréat.ChangementNomProjetEnregistréEvent;
  projet: {
    département: string;
    région: string;
  };
  baseUrl: string;
};

export const changementNomProjetEnregistréNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: ChangementNomProjetEnregistréNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (dreals.length === 0 && porteurs.length === 0) {
    getLogger().info('Aucun porteur ou dreal trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementNomProjetEnregistréNotifications',
    });
    return;
  }

  await sendEmail({
    templateId: lauréatNotificationTemplateId.nomProjet.enregistrerChangement,
    messageSubject: `Potentiel - Déclaration de changement de nom pour le projet ${event.payload.ancienNomProjet} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      ancien_nom_projet: event.payload.ancienNomProjet,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())})}`,
    },
  });

  await sendEmail({
    templateId: lauréatNotificationTemplateId.nomProjet.enregistrerChangement,
    messageSubject: `Potentiel - Déclaration de changement de nom pour le projet ${event.payload.ancienNomProjet} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      ancien_nom_projet: event.payload.ancienNomProjet,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())})}`,
    },
  });
};
