import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { updateManyProjections } from '@potentiel-infrastructure/pg-projection-write';

export const abandonConfirméProjector = async ({
  payload: { identifiantProjet, confirméLe, confirméPar },
}: Lauréat.Abandon.AbandonConfirméEvent) => {
  await updateManyProjections<Lauréat.Abandon.DemandeAbandonEntity>(
    'demande-abandon',
    {
      identifiantProjet: Where.equal(identifiantProjet),
      statut: Where.matchAny(Lauréat.Abandon.StatutAbandon.statutsEnCours),
    },
    {
      demande: {
        confirmation: {
          confirméLe,
          confirméPar,
        },
      },
      statut: Lauréat.Abandon.StatutAbandon.confirmé.statut,
      miseÀJourLe: confirméLe,
    },
  );
};
