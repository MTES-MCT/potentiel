import { Éliminé } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getÉliminé, listerDgecRecipients, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleRecoursDemandé = async ({ payload }: Éliminé.Recours.RecoursDemandéEvent) => {
  const projet = await getÉliminé(payload.identifiantProjet);

  const { appelOffre, période } = projet.identifiantProjet;
  const porteursRecipients = await listerPorteursRecipients(projet.identifiantProjet);
  const adminRecipients = await listerDgecRecipients(projet.identifiantProjet);

  const values = {
    nom_projet: projet.nom,
    departement_projet: projet.département,
    appelOffre,
    période,
    url: `${getBaseUrl()}${Routes.Recours.détailPourRedirection(payload.identifiantProjet)}`,
  };

  await sendEmail({
    key: 'recours/demander',
    recipients: porteursRecipients,
    values,
  });

  for (const recipient of adminRecipients) {
    await sendEmail({
      key: 'recours/demander',
      recipients: [recipient],
      values,
    });
  }
};
