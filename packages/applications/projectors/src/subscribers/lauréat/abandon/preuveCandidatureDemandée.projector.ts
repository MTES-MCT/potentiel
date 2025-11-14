import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';

export const preuveCandidatureDemandéeProjector = async ({
  payload: { identifiantProjet, demandéeLe },
}: Lauréat.Abandon.PreuveRecandidatureDemandéeEvent) => {
  await updateOneProjection<Lauréat.Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    miseÀJourLe: demandéeLe,
    demande: {
      recandidature: {
        statut: Lauréat.Abandon.StatutPreuveRecandidature.enAttente.statut,
        preuve: {
          demandéeLe,
        },
      },
    },
  });
};
