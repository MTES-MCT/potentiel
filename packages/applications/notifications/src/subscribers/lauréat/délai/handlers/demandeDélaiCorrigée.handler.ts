import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { buildUrl, getLauréat, listerRecipientsAutoritéInstructrice } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleDemandeDélaiCorrigée = async ({
  payload,
}: Lauréat.Délai.DemandeDélaiCorrigéeEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const { appelOffre, période } = projet.identifiantProjet;

  const demande = await mediator.send<Lauréat.Délai.ConsulterDemandeDélaiQuery>({
    type: 'Lauréat.Délai.Query.ConsulterDemandeDélai',
    data: {
      identifiantProjet: projet.identifiantProjet.formatter(),
      demandéLe: payload.dateDemande,
    },
  });

  if (Option.isNone(demande)) {
    throw new Error("La demande de délai n'a pas été trouvée");
  }

  const recipients = await listerRecipientsAutoritéInstructrice({
    identifiantProjet: projet.identifiantProjet,
    région: projet.région,
    domain: 'délai',
    motif: demande.motif,
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
