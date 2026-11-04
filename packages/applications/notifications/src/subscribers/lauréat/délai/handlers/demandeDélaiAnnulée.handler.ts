import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { buildUrl, getLauréat, listerRecipientsAutoritéInstructrice } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handleDemandeDélaiAnnulée = async ({
  payload,
}: Lauréat.Délai.DemandeDélaiAnnuléeEvent) => {
  const projet = await getLauréat(payload.identifiantProjet);

  const { appelOffre, période } = projet.identifiantProjet;

  const demande = await mediator.send<Lauréat.Délai.ConsulterDemandeDélaiQuery>({
    type: 'Lauréat.Délai.Query.ConsulterDemandeDélai',
    data: {
      identifiantProjet: projet.identifiantProjet.formatter(),
      demandéLe: payload.dateDemande,
    },
  });

  const motif = Option.isSome(demande)
    ? demande.motif
    : Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement;

  const recipients = await listerRecipientsAutoritéInstructrice({
    identifiantProjet: projet.identifiantProjet,
    région: projet.région,
    domain: 'délai',
    motif,
  });

  return sendEmail({
    key: 'délai/annuler',
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
