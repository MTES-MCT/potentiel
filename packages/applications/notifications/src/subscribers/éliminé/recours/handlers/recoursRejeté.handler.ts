import { Éliminé } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import {
  getBaseUrl,
  getÉliminé,
  listerCreRecipients,
  listerDgecRecipients,
  listerDrealsRecipients,
  listerPorteursRecipients,
} from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleRecoursRejeté = async ({ payload }: Éliminé.Recours.RecoursRejetéEvent) => {
  const projet = await getÉliminé(payload.identifiantProjet);

  const { appelOffre, période } = projet.identifiantProjet;

  const porteursRecipients = await listerPorteursRecipients(projet.identifiantProjet);
  const adminRecipients = await listerDgecRecipients(projet.identifiantProjet);
  const creRecipients = await listerCreRecipients();
  const drealRecipients = await listerDrealsRecipients(projet.région);

  for (const recipient of [porteursRecipients, adminRecipients, creRecipients, drealRecipients]) {
    await sendEmail({
      key: 'recours/rejeter',
      values: {
        nom_projet: projet.nom,
        departement_projet: projet.département,
        appelOffre,
        période,
        url: `${getBaseUrl()}${Routes.Recours.détailPourRedirection(projet.identifiantProjet.formatter())}`,
      },
      recipients: recipient,
    });
  }
};
