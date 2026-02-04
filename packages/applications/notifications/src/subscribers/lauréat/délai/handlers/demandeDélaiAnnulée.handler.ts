import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { getBaseUrl, getLauréat, listerRecipientsAutoritéInstructrice } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleDemandeDélaiAnnulée = async ({
  payload,
}: Lauréat.Délai.DemandeDélaiAnnuléeEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const { appelOffre, période } = projet.identifiantProjet;

  const recipients = await listerRecipientsAutoritéInstructrice({
    identifiantProjet: projet.identifiantProjet,
    région: projet.région,
    domain: 'délai',
  });

  return sendEmail({
    key: 'délai/annuler',
    recipients,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: appelOffre,
      période,
      url: `${getBaseUrl()}${Routes.Délai.détail(projet.identifiantProjet.formatter(), payload.dateDemande)}`,
    },
  });
};
