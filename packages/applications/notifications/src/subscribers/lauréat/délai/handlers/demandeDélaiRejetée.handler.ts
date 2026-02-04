import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getLauréat, listerPorteursRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleDemandeDélaiRejetée = async ({
  payload,
}: Lauréat.Délai.DemandeDélaiRejetéeEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const { appelOffre, période } = projet.identifiantProjet;

  const porteurs = await listerPorteursRecipients(projet.identifiantProjet);

  await sendEmail({
    key: 'délai/rejeter',
    recipients: porteurs,
    values: {
      appel_offre: appelOffre,
      période,
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${getBaseUrl()}${Routes.Délai.détail(projet.identifiantProjet.formatter(), payload.dateDemande)}`,
    },
  });
};
