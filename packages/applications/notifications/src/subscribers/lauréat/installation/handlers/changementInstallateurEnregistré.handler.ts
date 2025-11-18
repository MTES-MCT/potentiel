import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { listerPorteursRecipients, listerDrealsRecipients } from '#helpers';

import { InstallationNotificationsProps } from '../type.js';
import { installationNotificationTemplateId } from '../constant.js';

export const handleChangementInstallateurEnregistréNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: InstallationNotificationsProps<Lauréat.Installation.ChangementInstallateurEnregistréEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  await sendEmail({
    templateId: installationNotificationTemplateId.enregistrerChangementInstallateur,
    messageSubject: `Potentiel - Déclaration de changement d'installateur pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Installation.changement.installateur.détails(identifiantProjet.formatter(), event.payload.enregistréLe)}`,
    },
  });

  await sendEmail({
    templateId: installationNotificationTemplateId.enregistrerChangementInstallateur,
    messageSubject: `Potentiel - Déclaration de changement d'installateur pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Installation.changement.installateur.détails(identifiantProjet.formatter(), event.payload.enregistréLe)}`,
    },
  });
};
