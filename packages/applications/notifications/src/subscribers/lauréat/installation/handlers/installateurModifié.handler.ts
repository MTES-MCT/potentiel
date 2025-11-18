import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { listerDrealsRecipients, listerPorteursRecipients } from '#helpers';

import { installationNotificationTemplateId } from '../constant.js';
import { InstallationNotificationsProps } from '../type.js';

export const handleInstallateurModifié = async ({
  sendEmail,
  event,
  projet,
}: InstallationNotificationsProps<Lauréat.Installation.InstallateurModifiéEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  await sendEmail({
    templateId: installationNotificationTemplateId.modifierInstallateur,
    messageSubject: `Potentiel - Modification de l'installateur pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });

  await sendEmail({
    templateId: installationNotificationTemplateId.modifierInstallateur,
    messageSubject: `Potentiel - Modification de l'installateur pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
