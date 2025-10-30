import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients } from '../../../_helpers';

import { RegisterProducteurNotificationDependencies } from '.';

import { producteurNotificationTemplateId } from './constant';

type ChangementProducteurEnregistréNotificationProps = {
  sendEmail: RegisterProducteurNotificationDependencies['sendEmail'];
  event: Lauréat.Producteur.ChangementProducteurEnregistréEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
  };
  baseUrl: string;
};

export const changementProducteurEnregistréNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: ChangementProducteurEnregistréNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  if (dreals.length === 0) {
    getLogger().info('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementProducteurEnregistréNotifications',
    });
    return;
  }

  await sendEmail({
    templateId: producteurNotificationTemplateId.enregistrerChangement,
    messageSubject: `Potentiel - Déclaration de changement de producteur pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Producteur.changement.détails(identifiantProjet.formatter(), event.payload.enregistréLe)}`,
    },
  });
};
