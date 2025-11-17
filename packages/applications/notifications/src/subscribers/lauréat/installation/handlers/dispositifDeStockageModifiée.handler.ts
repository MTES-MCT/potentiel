import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { listerDrealsRecipients, listerPorteursRecipients } from '#helpers';

import { installationNotificationTemplateId } from '../constant.js';
import { InstallationNotificationsProps } from '../type.js';

export const handleDispositifDeStockageModifié = async ({
  sendEmail,
  event,
  projet,
}: InstallationNotificationsProps<Lauréat.Installation.DispositifDeStockageModifiéEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  await sendEmail({
    templateId: installationNotificationTemplateId.modifierDispositifDeStockage,
    messageSubject: `Potentiel - Modification du couplage avec un dispositif de stockage pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });

  await sendEmail({
    templateId: installationNotificationTemplateId.modifierDispositifDeStockage,
    messageSubject: `Potentiel - Modification du couplage avec un dispositif de stockage pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
