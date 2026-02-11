import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getLauréat, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleConfirmationAbandonDemandée = async ({
  payload,
}: Lauréat.Abandon.ConfirmationAbandonDemandéeEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  await sendEmail({
    key: 'abandon/demander_confirmation',
    recipients: porteurs,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
      url: `${getBaseUrl()}${Routes.Abandon.détailRedirection(payload.identifiantProjet)}`,
    },
  });
};
