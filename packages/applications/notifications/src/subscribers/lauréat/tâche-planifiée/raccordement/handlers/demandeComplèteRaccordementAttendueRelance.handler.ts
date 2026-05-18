import { Routes } from '@potentiel-applications/routes';

import { buildUrl, getLauréat, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';
import type { TâchePlanifiéeRaccordementNotificationProps } from '../tâche-planifiée.raccordement.notifications.js';

export const handleDemandeComplèteRaccordementAttendueRelance = async ({
  identifiantProjet,
}: TâchePlanifiéeRaccordementNotificationProps) => {
  const lauréat = await getLauréat(identifiantProjet.formatter());

  const recipients = await listerPorteursRecipients(identifiantProjet);

  await sendEmail({
    key: 'lauréat/raccordement/rappel_transmission_dcr',
    recipients,
    values: {
      nom_projet: lauréat.nom,
      appel_offre: lauréat.identifiantProjet.appelOffre,
      période: lauréat.identifiantProjet.période,
      departement_projet: lauréat.département,
      url: buildUrl(
        Routes.Raccordement.transmettreDemandeComplèteRaccordement(identifiantProjet.formatter()),
      ),
    },
  });
};
