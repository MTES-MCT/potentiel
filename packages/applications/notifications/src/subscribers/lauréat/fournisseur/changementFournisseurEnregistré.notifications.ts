import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients, listerPorteursRecipients } from '../../../_helpers';

import { RegisterFournisseurNotificationDependencies } from '.';

import { fournisseurNotificationTemplateId } from './constant';

type ChangementFournisseurEnregistréNotificationsProps = {
  sendEmail: RegisterFournisseurNotificationDependencies['sendEmail'];
  event: Lauréat.Fournisseur.ChangementFournisseurEnregistréEvent;
  projet: {
    nom: string;
    région: string;
    département: string;
    url: string;
  };
};

export const changementFournisseurEnregistréNotifications = async ({
  sendEmail,
  event,
  projet,
}: ChangementFournisseurEnregistréNotificationsProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (dreals.length === 0 && porteurs.length === 0) {
    getLogger().info('Aucune dreal ou porteur trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'changementFournisseurEnregistréNotifications',
    });
    return;
  }

  await sendEmail({
    templateId: fournisseurNotificationTemplateId.changement.enregistrer,
    messageSubject: `Potentiel - Déclaration de changement de fournisseur pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });

  await sendEmail({
    templateId: fournisseurNotificationTemplateId.changement.enregistrer,
    messageSubject: `Potentiel - Déclaration de changement de fournisseur pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
