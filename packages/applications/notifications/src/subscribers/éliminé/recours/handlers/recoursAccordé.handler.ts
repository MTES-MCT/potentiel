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

export const handleRecoursAccordé = async ({ payload }: Éliminé.Recours.RecoursAccordéEvent) => {
  const projet = await getÉliminé(payload.identifiantProjet);

  const { appelOffre, période } = projet.identifiantProjet;

  const porteursRecipients = await listerPorteursRecipients(projet.identifiantProjet);
  const adminRecipients = await listerDgecRecipients(projet.identifiantProjet);
  const creRecipients = await listerCreRecipients();
  const drealRecipients = await listerDrealsRecipients(projet.région);

  for (const recipients of [porteursRecipients, adminRecipients, creRecipients, drealRecipients]) {
    await sendEmail({
      key: 'recours/accorder',

      values: {
        nom_projet: projet.nom,

        departement_projet: projet.département,
        appelOffre,
        période,
        url: `${getBaseUrl()}${Routes.Recours.détailPourRedirection(projet.identifiantProjet.formatter())}`,
      },
      recipients,
    });
  }
};
