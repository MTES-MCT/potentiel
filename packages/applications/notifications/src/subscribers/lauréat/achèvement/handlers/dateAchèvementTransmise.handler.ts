import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { listerDrealsRecipients, listerPorteursRecipients } from '../../../../_helpers';
import { AchèvementNotificationsProps } from '../type';
import { achèvementNotificationTemplateId } from '../constant';

export const handleDateAchèvementTransmise = async ({
  sendEmail,
  event,
  projet,
}: AchèvementNotificationsProps<Lauréat.Achèvement.DateAchèvementTransmiseEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);

  const porteurs = await listerPorteursRecipients(identifiantProjet);

  await sendEmail({
    templateId: achèvementNotificationTemplateId.transmettreDateAchèvement.porteur,
    messageSubject: `Potentiel - Transmission de la date d'achèvement du projet ${projet.nom} dans le département ${projet.département}`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });

  const dreals = await listerDrealsRecipients(projet.région);

  await sendEmail({
    templateId: achèvementNotificationTemplateId.transmettreDateAchèvement.dreal,
    messageSubject: `Potentiel - Transmission de la date d'achèvement du projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: projet.url,
    },
  });
};
