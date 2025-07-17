import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients, listerPorteursRecipients } from '../../../helpers';

import { RegisterAttestationConformitéNotificationDependencies } from '.';

type AttestationConformitéTransmiseNotificationsProps = {
  sendEmail: RegisterAttestationConformitéNotificationDependencies['sendEmail'];
  event: Lauréat.Achèvement.AttestationConformité.AttestationConformitéTransmiseEvent;
  projet: {
    nom: string;
    région: string;
    département: string;
    url: string;
  };
};

export const attestationConformitéTransmiseNotifications = async ({
  sendEmail,
  event,
  projet,
}: AttestationConformitéTransmiseNotificationsProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);

  const porteurs = await listerPorteursRecipients(identifiantProjet);

  if (porteurs.length === 0) {
    getLogger().error('Aucun porteur trouvé', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
    });
    return;
  }
  await sendEmail({
    templateId: 6409011,
    messageSubject: `Potentiel - Mise à jour de la date d'achèvement du projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      type: 'accord',
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });

  const dreals = await listerDrealsRecipients(projet.région);

  if (dreals.length === 0) {
    getLogger().info('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
    });
    return;
  }

  await sendEmail({
    templateId: 5945568,
    messageSubject: `Potentiel - Une attestation de conformité a été transmise pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      type: 'accord',
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
