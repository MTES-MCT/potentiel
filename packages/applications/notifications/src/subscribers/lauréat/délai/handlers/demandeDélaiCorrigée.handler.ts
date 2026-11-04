import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { buildUrl, getLauréat, listerRecipientsAutoritéInstructrice } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleDemandeDélaiCorrigée = async (
  event: Lauréat.Délai.DemandeDélaiCorrigéeEvent | Lauréat.Délai.DemandeDélaiCorrigéeEventV1,
) => {
  const { payload } = event;
  const projet = await getLauréat(payload.identifiantProjet);

  const { appelOffre, période } = projet.identifiantProjet;

  const motif =
    event.type === 'DemandeDélaiCorrigée-V2'
      ? Lauréat.Délai.MotifDemandeDélai.convertirEnValueType(event.payload.motif)
      : Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement;

  const recipients = await listerRecipientsAutoritéInstructrice({
    identifiantProjet: projet.identifiantProjet,
    région: projet.région,
    domain: 'délai',
    motif,
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
