import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { listerDrealsRecipients, listerPorteursRecipients } from '#helpers';

import type { AchèvementNotificationsProps } from '../type.js';
import { achèvementNotificationTemplateId } from '../constant.js';

export const handleAttestationConformitéTransmise = async ({
  sendEmail,
  event,
  projet,
}: AchèvementNotificationsProps<Lauréat.Achèvement.AttestationConformitéTransmiseEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);

  const porteurs = await listerPorteursRecipients(identifiantProjet);

  await sendEmail({
    templateId: achèvementNotificationTemplateId.transmettreAttestationConformité,
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
