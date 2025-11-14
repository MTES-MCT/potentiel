import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';

import { InstallationNotificationsProps } from '../type';
import { installationNotificationTemplateId } from '../constant';
import { listerPorteursRecipients, listerDrealsRecipients } from '../../../../_helpers';

export const handleChangementDispositifDeStockageEnregistréNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: InstallationNotificationsProps<Lauréat.Installation.ChangementDispositifDeStockageEnregistréEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  if (dreals.length === 0 && porteurs.length === 0) {
    getLogger().info('Aucune dreal ou porteur trouvé(e)', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementDispositifDeStockageEnregistréNotification',
    });
    return;
  }

  await sendEmail({
    templateId: installationNotificationTemplateId.enregistrerChangementDispositifDeStockage,
    messageSubject: `Potentiel - Déclaration de changement de dispositif de stockage pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Installation.changement.dispositifDeStockage.détails(identifiantProjet.formatter(), event.payload.enregistréLe)}`,
    },
  });

  await sendEmail({
    templateId: installationNotificationTemplateId.enregistrerChangementDispositifDeStockage,
    messageSubject: `Potentiel - Déclaration de changement de dispositif de stockage pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Installation.changement.dispositifDeStockage.détails(identifiantProjet.formatter(), event.payload.enregistréLe)}`,
    },
  });
};
