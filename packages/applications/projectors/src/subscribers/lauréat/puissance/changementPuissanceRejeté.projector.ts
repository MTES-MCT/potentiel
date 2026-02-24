import { Lauréat } from '@potentiel-domain/projet';
import {
  updateManyProjections,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Where } from '@potentiel-domain/entity';

export const changementPuissanceRejetéProjector = async ({
  payload: { identifiantProjet, rejetéLe, rejetéPar, réponseSignée },
}: Lauréat.Puissance.ChangementPuissanceRejetéEvent) => {
  await updateOneProjection<Lauréat.Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    dernièreDemande: { statut: Lauréat.Puissance.StatutChangementPuissance.rejeté.statut },
  });

  await updateManyProjections<Lauréat.Puissance.ChangementPuissanceEntity>(
    'changement-puissance',
    {
      identifiantProjet: Where.equal(identifiantProjet),
      demande: {
        statut: Where.equal(Lauréat.Puissance.StatutChangementPuissance.demandé.statut),
      },
    },
    {
      miseÀJourLe: rejetéLe,
      demande: {
        statut: Lauréat.Puissance.StatutChangementPuissance.rejeté.statut,
        rejet: {
          rejetéeLe: rejetéLe,
          rejetéePar: rejetéPar,
          réponseSignée,
        },
      },
    },
  );
};
