import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';

export const preuveCandidatureTransmiseProjector = async ({
  payload: { identifiantProjet, preuveRecandidature, transmiseLe, transmisePar },
}: Lauréat.Abandon.PreuveRecandidatureTransmiseEvent) => {
  await updateOneProjection<Lauréat.Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    miseÀJourLe: transmiseLe,
    demande: {
      recandidature: {
        statut: Lauréat.Abandon.StatutPreuveRecandidature.transmis.statut,
        preuve: {
          identifiantProjet: preuveRecandidature,
          transmiseLe,
          transmisePar,
        },
      },
    },
  });
};
