import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import {
  updateManyProjections,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const abandonAnnuléProjector = async ({
  payload: { identifiantProjet, annuléLe, annuléPar },
}: Lauréat.Abandon.AbandonAnnuléEvent) => {
  await updateOneProjection<Lauréat.Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    dernièreDemande: { statut: 'annulé' },
  });
  await updateManyProjections<Lauréat.Abandon.DemandeAbandonEntity>(
    'demande-abandon',
    {
      identifiantProjet: Where.equal(identifiantProjet),
      statut: Where.matchAny(Lauréat.Abandon.StatutAbandon.statutsEnCours),
    },
    {
      demande: {
        annulation: {
          annuléLe,
          annuléPar,
        },
      },
      statut: Lauréat.Abandon.StatutAbandon.annulé.statut,
      miseÀJourLe: annuléLe,
    },
  );
};
