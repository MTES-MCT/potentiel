import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';

import { listerDrealsRecipients, listerPorteursRecipients } from '../../../helpers';

import { RegisterInstallationNotificationDependencies } from '.';

import { installationNotificationTemplateId } from './constant';

type ChangementInstallateurEnregistréNotificationProps = {
  sendEmail: RegisterInstallationNotificationDependencies['sendEmail'];
  event: Lauréat.Installation.ChangementInstallateurEnregistréEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
  };
  baseUrl: string;
};

export const changementInstallateurEnregistréNotification = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: ChangementInstallateurEnregistréNotificationProps) => {
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
      url: `${baseUrl}${Routes.Installation.changementInstallateur.détails(identifiantProjet.formatter(), event.payload.enregistréLe)}`,
    },
  });

  await sendEmail({
    templateId: installationNotificationTemplateId.enregistrerChangementInstallateur,
    messageSubject: `Potentiel - Déclaration de changement d'installateur pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Installation.changementInstallateur.détails(identifiantProjet.formatter(), event.payload.enregistréLe)}`,
    },
  });
};
