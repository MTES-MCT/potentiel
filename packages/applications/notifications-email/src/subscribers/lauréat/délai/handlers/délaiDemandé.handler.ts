import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { buildUrl, getLauréat, listerRecipientsAutoritéInstructrice } from '#helpers';
import { sendEmail } from '#sendEmail';
import { getMotifDélaiLabel } from '../helpers/getMotifDélaiLabel.js';

export const handleDélaiDemandé = async (event: Lauréat.Délai.DélaiDemandéEvent) => {
  const projet = await getLauréat(event.payload.identifiantProjet);

  const { appelOffre, période } = projet.identifiantProjet;

  const motif = Lauréat.Délai.MotifDemandeDélai.convertirEnValueType(event.payload.motif);

  const recipients = await listerRecipientsAutoritéInstructrice({
    identifiantProjet: projet.identifiantProjet,
    région: projet.région,
    domain: 'délai',
    motif,
  });

  return sendEmail({
    key: 'délai/demander',
    recipients,
    values: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      appel_offre: appelOffre,
      période,
      url: buildUrl(
        Routes.Délai.détail(projet.identifiantProjet.formatter(), event.payload.demandéLe),
      ),
      motif_demande: getMotifDélaiLabel(motif.formatter()),
    },
  });
};
