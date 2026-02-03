import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import {
  getBaseUrl,
  getLauréat,
  listerCocontractantRecipients,
  listerCreRecipients,
  listerDrealsRecipients,
  listerPorteursRecipients,
} from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleAbandonAccordé = async ({ payload }: Lauréat.Abandon.AbandonAccordéEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);
  const { appelOffre, période } = projet.identifiantProjet;
  const porteursRecipients = await listerPorteursRecipients(projet.identifiantProjet);
  const creRecipients = await listerCreRecipients();
  const drealRecipients = await listerDrealsRecipients(projet.région);
  const cocontractantsRecipients = await listerCocontractantRecipients(projet.région);

  const values = {
    nom_projet: projet.nom,
    departement_projet: projet.département,
    url: `${getBaseUrl()}${Routes.Abandon.détailRedirection(payload.identifiantProjet)}`,
    appelOffre,
    période,
  };

  await sendEmail({
    key: 'abandon/accorder',
    recipients: porteursRecipients,
    values,
  });

  for (const recipient of [...creRecipients, ...drealRecipients, ...cocontractantsRecipients]) {
    await sendEmail({
      key: 'abandon/accorder',
      recipients: [recipient],
      values,
    });
  }
};
