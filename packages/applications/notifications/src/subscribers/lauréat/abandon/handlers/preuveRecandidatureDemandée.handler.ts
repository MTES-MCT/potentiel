import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getLauréat, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handlePreuveRecandidatureDemandée = async ({
  payload,
}: Lauréat.Abandon.PreuveRecandidatureDemandéeEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);
  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  await sendEmail({
    key: 'abandon/demander_preuve_recandidature',
    recipients: porteurs,
    values: {
      nom_projet: projet.nom,
      appel_offre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
      departement_projet: projet.département,
      url: `${getBaseUrl()}${Routes.Abandon.détailRedirection(projet.identifiantProjet.formatter())}/`,
    },
  });
};
