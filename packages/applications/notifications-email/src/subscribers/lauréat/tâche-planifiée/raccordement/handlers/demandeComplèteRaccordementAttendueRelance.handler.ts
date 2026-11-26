import { Routes } from '@potentiel-applications/routes';
import { nombresEnToutesLettres } from '@potentiel-domain/inmemory-referential';

import {
  buildUrl,
  getCahierDesChargesLauréat,
  getLauréat,
  listerPorteursRecipients,
} from '#helpers';
import { sendEmail } from '#sendEmail';
import type { TâchePlanifiéeRaccordementNotificationProps } from '../tâche-planifiée.raccordement.notifications.js';

export const handleDemandeComplèteRaccordementAttendueRelance = async ({
  identifiantProjet,
}: TâchePlanifiéeRaccordementNotificationProps) => {
  const lauréat = await getLauréat(identifiantProjet.formatter());
  const délaiDCR = (await getCahierDesChargesLauréat(identifiantProjet)).getDélaiDCR();

  const recipients = await listerPorteursRecipients(identifiantProjet);

  await sendEmail({
    key: 'lauréat/raccordement/rappel_transmission_dcr',
    recipients,
    values: {
      nom_projet: lauréat.nom,
      appel_offre: lauréat.identifiantProjet.appelOffre,
      période: lauréat.identifiantProjet.période,
      departement_projet: lauréat.département,
      délai_transmission_dcr_grd: délaiDCR.grd ? nombresEnToutesLettres[délaiDCR.grd] : '',
      délai_transmission_dcr_potentiel: délaiDCR.potentiel
        ? nombresEnToutesLettres[délaiDCR.potentiel]
        : '',
      url: buildUrl(
        Routes.Raccordement.transmettreDemandeComplèteRaccordement(identifiantProjet.formatter()),
      ),
    },
  });
};
