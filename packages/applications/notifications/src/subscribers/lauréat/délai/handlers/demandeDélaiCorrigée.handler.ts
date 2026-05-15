import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { buildUrl, getLauréat, listerRecipientsAutoritéInstructrice } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleDemandeDélaiCorrigée = async ({
  payload,
}: Lauréat.Délai.DemandeDélaiCorrigéeEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const { appelOffre, période } = projet.identifiantProjet;

  const recipients = await listerRecipientsAutoritéInstructrice({
    identifiantProjet: projet.identifiantProjet,
    région: projet.région,
    domain: 'délai',
  });

  return sendEmail({
    key: 'délai/corriger',
    recipients,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: appelOffre,
      période,
      url: buildUrl(Routes.Délai.détail(projet.identifiantProjet.formatter(), payload.dateDemande)),
    },
  });
};
