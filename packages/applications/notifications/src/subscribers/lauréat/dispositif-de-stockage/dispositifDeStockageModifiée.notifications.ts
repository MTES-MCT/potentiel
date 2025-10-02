import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients, listerPorteursRecipients } from '../../../helpers';

import { RegisterDispositifDeStockageNotificationDependencies } from '.';

import { dispositifDeStockageNotificationTemplateId } from './constant';

type DispositifDeStockageModifiéNotificationsProps = {
  sendEmail: RegisterDispositifDeStockageNotificationDependencies['sendEmail'];
  event: Lauréat.DispositifDeStockage.DispositifDeStockageModifiéEvent;
  projet: {
    nom: string;
    région: string;
    département: string;
    url: string;
  };
};

export const DispositifDeStockageModifiéNotifications = async ({
  sendEmail,
  event,
  projet,
}: DispositifDeStockageModifiéNotificationsProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  if (porteurs.length === 0 && dreals.length === 0) {
    getLogger().error('Aucun porteur ou dreal trouvé(e)', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'dispositifDeStockage.notifications.ts',
    });
    return;
  }

  await sendEmail({
    templateId: dispositifDeStockageNotificationTemplateId.modifier,
    messageSubject: `Potentiel - Modification du couplage avec un dispositif de stockage pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });

  await sendEmail({
    templateId: dispositifDeStockageNotificationTemplateId.modifier,
    messageSubject: `Potentiel - Modification du couplage avec un dispositif de stockage pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
