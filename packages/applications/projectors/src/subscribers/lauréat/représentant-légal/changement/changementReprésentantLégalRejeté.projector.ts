import { Lauréat } from '@potentiel-domain/projet';
import {
  updateManyProjections,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Where } from '@potentiel-domain/entity';

export const changementReprésentantLégalRejetéProjector = async (
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalRejetéEvent,
) => {
  const {
    payload: { identifiantProjet, motifRejet, rejetéLe, rejetéPar },
  } = event;

  await updateManyProjections<Lauréat.ReprésentantLégal.ChangementReprésentantLégalEntity>(
    'changement-représentant-légal',
    {
      identifiantProjet: Where.equal(identifiantProjet),
      demande: {
        statut: Where.equal(
          Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.demandé.statut,
        ),
      },
    },
    {
      miseÀJourLe: rejetéLe,
      demande: {
        statut: Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.rejeté.statut,
        rejet: {
          motif: motifRejet,
          rejetéLe,
          rejetéPar,
        },
      },
    },
  );

  await updateOneProjection<Lauréat.ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
    {
      dernièreDemande: {
        statut: Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.rejeté.statut,
      },
    },
  );
};
