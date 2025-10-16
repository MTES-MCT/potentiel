import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients, listerPorteursRecipients } from '../../../helpers';

import { RegisterInstallationNotificationDependencies } from '.';

import { installationNotificationTemplateId } from './constant';

type TypologieDuProjetModifiéeNotificationProps = {
  sendEmail: RegisterInstallationNotificationDependencies['sendEmail'];
  event: Lauréat.Installation.TypologieDuProjetModifiéeEvent;
  projet: {
    nom: string;
    département: string;
    région: string;
    url: string;
  };
};

export const typologieDuProjetModifiéeNotification = async ({
  sendEmail,
  event,
  projet,
}: TypologieDuProjetModifiéeNotificationProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  if (dreals.length === 0 && porteurs.length === 0) {
    getLogger().info('Aucune dreal ou porteur trouvé(e)', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'typologieDuProjetModifiéeNotification',
    });
    return;
  }

  await sendEmail({
    templateId: installationNotificationTemplateId.modifierTypologieDuProjet,
    messageSubject: `Potentiel - Modification de la typologie du projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });

  await sendEmail({
    templateId: installationNotificationTemplateId.modifierTypologieDuProjet,
    messageSubject: `Potentiel - Modification de la typologie du projet ${projet.nom}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
