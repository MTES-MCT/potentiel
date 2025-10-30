import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients, listerPorteursRecipients } from '../../../_helpers';

import { RegisterInstallationNotificationDependencies } from '.';

import { installationNotificationTemplateId } from './constant';

type InstallateurModifiéNotificationProps = {
  sendEmail: RegisterInstallationNotificationDependencies['sendEmail'];
  event: Lauréat.Installation.InstallateurModifiéEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
    url: string;
  };
};

export const installateurModifiéNotification = async ({
  sendEmail,
  event,
  projet,
}: InstallateurModifiéNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  if (dreals.length === 0 && porteurs.length === 0) {
    getLogger().info('Aucune dreal ou porteur trouvé(e)', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'installateurModifiéNotifications',
    });
    return;
  }

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
