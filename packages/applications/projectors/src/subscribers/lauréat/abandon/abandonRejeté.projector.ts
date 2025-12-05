import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import {
  updateManyProjections,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const abandonRejetéProjector = async ({
  payload: { identifiantProjet, rejetéLe, rejetéPar, réponseSignée },
}: Lauréat.Abandon.AbandonRejetéEvent) => {
  await updateOneProjection<Lauréat.Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    dernièreDemande: { statut: 'rejeté' },
  });
  await updateManyProjections<Lauréat.Abandon.DemandeAbandonEntity>(
    'demande-abandon',
    {
      identifiantProjet: Where.equal(identifiantProjet),
      statut: Where.matchAny(Lauréat.Abandon.StatutAbandon.statutsEnCours),
    },
    {
      demande: {
        rejet: {
          rejetéLe,
          rejetéPar,
          réponseSignée: {
            format: réponseSignée.format,
          },
        },
      },
      statut: Lauréat.Abandon.StatutAbandon.rejeté.statut,
      miseÀJourLe: rejetéLe,
    },
  );
};
