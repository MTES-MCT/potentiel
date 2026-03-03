import { Lauréat } from '@potentiel-domain/projet';
import {
  updateManyProjections,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Where } from '@potentiel-domain/entity';

export const changementReprésentantLégalAccordéProjector = async (
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalAccordéEvent,
) => {
  const {
    payload: {
      identifiantProjet,
      nomReprésentantLégal,
      typeReprésentantLégal,
      accordéLe,
      accordéPar,
    },
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
      miseÀJourLe: accordéLe,
      demande: {
        statut: Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.accordé.formatter(),
        accord: {
          nomReprésentantLégal,
          typeReprésentantLégal,
          accordéLe,
          accordéPar,
        },
      },
    },
  );

  await updateOneProjection<Lauréat.ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
    {
      identifiantProjet,
      nomReprésentantLégal,
      typeReprésentantLégal,
      dernièreDemande: {
        statut: Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.accordé.statut,
      },
    },
  );
};
