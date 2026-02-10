import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getLauréat, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleDemandeDélaiPasséeEnInstruction = async ({
  payload,
}: Lauréat.Délai.DemandeDélaiPasséeEnInstructionEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const { appelOffre, période } = projet.identifiantProjet;

  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  await sendEmail({
    key: 'délai/passer_en_instruction',
    recipients: porteurs,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: appelOffre,
      période,
      url: `${getBaseUrl()}${Routes.Délai.détail(projet.identifiantProjet.formatter(), payload.dateDemande)}`,
    },
  });
};
