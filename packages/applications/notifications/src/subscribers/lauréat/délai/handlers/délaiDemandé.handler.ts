import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import {
  buildUrl,
  getLauréat,
  listerDgecRecipients,
  listerRecipientsAutoritéInstructrice,
} from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleDélaiDemandé = async (
  event: Lauréat.Délai.DélaiDemandéEvent | Lauréat.Délai.DélaiDemandéEventV1,
) => {
  const projet = await getLauréat(event.payload.identifiantProjet);

  const { appelOffre, période } = projet.identifiantProjet;

  const motif =
    event.type === 'DélaiDemandé-V2'
      ? Lauréat.Délai.MotifDemandeDélai.convertirEnValueType(event.payload.motif)
      : Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement;

  const recipients = motif.estProlongationPhaseEssai()
    ? await listerDgecRecipients(projet.identifiantProjet)
    : await listerRecipientsAutoritéInstructrice({
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
      url: buildUrl(
        Routes.Délai.détail(projet.identifiantProjet.formatter(), event.payload.demandéLe),
      ),
    },
  });
};
