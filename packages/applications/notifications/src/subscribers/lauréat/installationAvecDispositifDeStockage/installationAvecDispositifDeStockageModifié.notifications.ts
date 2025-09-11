import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients, listerPorteursRecipients } from '../../../helpers';

import { RegisterInstallationAvecDispositifDeStockageNotificationDependencies } from '.';

import { installationAvecDispositifDeStockageNotificationTemplateId } from './constant';

type installationAvecDispositifDeStockageModifiéNotificationsProps = {
  sendEmail: RegisterInstallationAvecDispositifDeStockageNotificationDependencies['sendEmail'];
  event: Lauréat.InstallationAvecDispositifDeStockage.InstallationAvecDispositifDeStockageModifiéEvent;
  projet: {
    nom: string;
    région: string;
    département: string;
    url: string;
  };
};

export const installationAvecDispositifDeStockageModifiéNotifications = async ({
  sendEmail,
  event,
  projet,
}: installationAvecDispositifDeStockageModifiéNotificationsProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  if (porteurs.length === 0 && dreals.length === 0) {
    getLogger().error('Aucun porteur ou dreal trouvé(e)', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'installationAvecDispositifDeStockage.notifications.ts',
    });
    return;
  }

  await sendEmail({
    templateId: installationAvecDispositifDeStockageNotificationTemplateId.modifier,
    messageSubject: `Potentiel - Modification du couplage avec un dispositif de stockage pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });

  await sendEmail({
    templateId: installationAvecDispositifDeStockageNotificationTemplateId.modifier,
    messageSubject: `Potentiel - Modification du couplage avec un dispositif de stockage pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
