import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { getBaseUrl, getLauréat, listerRecipientsAutoritéInstructrice } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleDélaiDemandé = async ({ payload }: Lauréat.Délai.DélaiDemandéEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const { appelOffre, période } = projet.identifiantProjet;

  const recipients = await listerRecipientsAutoritéInstructrice({
    identifiantProjet: projet.identifiantProjet,
    région: projet.région,
    domain: 'délai',
  });

  return sendEmail({
    key: 'délai/demander',
    recipients,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: appelOffre,
      période,
      url: `${getBaseUrl()}${Routes.Délai.détail(projet.identifiantProjet.formatter(), payload.demandéLe)}`,
    },
  });
};
