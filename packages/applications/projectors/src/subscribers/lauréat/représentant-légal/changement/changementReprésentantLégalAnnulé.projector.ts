import {
  updateManyProjections,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';
import { Where } from '@potentiel-domain/entity';

export const changementReprésentantLégalAnnuléProjector = async (
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalAnnuléEvent,
) => {
  const {
    payload: { identifiantProjet },
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
      demande: {
        statut: Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.annulé.statut,
      },
    },
  );

  await updateOneProjection<Lauréat.ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
    {
      demandeEnCours: { demandéLe: undefined },
    },
  );
};
