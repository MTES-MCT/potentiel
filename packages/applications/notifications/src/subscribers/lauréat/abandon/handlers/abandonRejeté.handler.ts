import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { buildUrl, getLauréat, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleAbandonRejeté = async ({ payload }: Lauréat.Abandon.AbandonRejetéEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  await sendEmail({
    key: 'abandon/rejeter',
    recipients: porteurs,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: buildUrl(Routes.Abandon.détailRedirection(payload.identifiantProjet)),
      appel_offre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
    },
  });
};
