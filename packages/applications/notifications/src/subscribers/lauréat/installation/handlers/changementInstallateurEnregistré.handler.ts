import { listerPorteursRecipients, listerDrealsRecipients } from '@helpers';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';

import { InstallationNotificationsProps } from '../type';
import { installationNotificationTemplateId } from '../constant';

export const handleChangementInstallateurEnregistréNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: InstallationNotificationsProps<Lauréat.Installation.ChangementInstallateurEnregistréEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  if (dreals.length === 0 && porteurs.length === 0) {
    getLogger().info('Aucune dreal ou porteur trouvé(e)', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementInstallateurEnregistréNotification',
    });
    return;
  }

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
