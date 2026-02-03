import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getLauréat, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleAbandonPasséEnInstruction = async ({
  payload,
}: Lauréat.Abandon.AbandonPasséEnInstructionEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  await sendEmail({
    key: 'abandon/passerEnInstruction',
    recipients: porteurs,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${getBaseUrl()}${Routes.Abandon.détailRedirection(payload.identifiantProjet)}`,
    },
  });
};
