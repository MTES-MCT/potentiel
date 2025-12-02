import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import {
  updateManyProjections,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const preuveCandidatureTransmiseProjector = async ({
  payload: { identifiantProjet, preuveRecandidature, transmiseLe, transmisePar },
}: Lauréat.Abandon.PreuveRecandidatureTransmiseEvent) => {
  const recandidature = {
    statut: Lauréat.Abandon.StatutPreuveRecandidature.transmis.statut,
    preuve: {
      identifiantProjet: preuveRecandidature,
      transmiseLe,
      transmisePar,
    },
  };
  await updateOneProjection<Lauréat.Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    recandidature,
  });
  await updateManyProjections<Lauréat.Abandon.DemandeAbandonEntity>(
    'demande-abandon',
    {
      identifiantProjet: Where.equal(identifiantProjet),
      statut: Where.equal(Lauréat.Abandon.StatutAbandon.accordé.statut),
    },
    {
      miseÀJourLe: transmiseLe,
      demande: {
        recandidature,
      },
    },
  );
};
