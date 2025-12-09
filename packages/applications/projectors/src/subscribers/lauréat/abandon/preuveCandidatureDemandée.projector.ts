import { updateManyProjections } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';
import { Where } from '@potentiel-domain/entity';

export const preuveCandidatureDemandéeProjector = async ({
  payload: { identifiantProjet, demandéeLe },
}: Lauréat.Abandon.PreuveRecandidatureDemandéeEvent) => {
  const recandidature = {
    statut: Lauréat.Abandon.StatutPreuveRecandidature.enAttente.statut,
    preuve: {
      demandéeLe,
    },
  };

  await updateManyProjections<Lauréat.Abandon.DemandeAbandonEntity>(
    'demande-abandon',
    {
      identifiantProjet: Where.equal(identifiantProjet),
      statut: Where.equal(Lauréat.Abandon.StatutAbandon.accordé.statut),
    },
    {
      miseÀJourLe: demandéeLe,
      demande: {
        recandidature,
      },
    },
  );
};
