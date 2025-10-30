import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients, listerPorteursRecipients } from '../../../_helpers';

import { RegisterFournisseurNotificationDependencies } from '.';

import { fournisseurNotificationTemplateId } from './constant';

type FournisseurModifiéNotificationsProps = {
  sendEmail: RegisterFournisseurNotificationDependencies['sendEmail'];
  event: Lauréat.Fournisseur.FournisseurModifiéEvent;
  projet: {
    nom: string;
    région: string;
    département: string;
    url: string;
  };
};

export const fournisseurModifiéNotifications = async ({
  sendEmail,
  event,
  projet,
}: FournisseurModifiéNotificationsProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(identifiantProjet);
  const dreals = await listerDrealsRecipients(projet.région);

  if (porteurs.length === 0 && dreals.length === 0) {
    getLogger().error('Aucun porteur ou dreal trouvé(e)', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'fournisseurModifié.notifications.ts',
    });
    return;
  }

  await sendEmail({
    templateId: fournisseurNotificationTemplateId.modifier,
    messageSubject: `Potentiel - Modification du fournisseur pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });

  await sendEmail({
    templateId: fournisseurNotificationTemplateId.modifier,
    messageSubject: `Potentiel - Modification du fournisseur pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
