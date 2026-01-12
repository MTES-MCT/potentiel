import {
  updateManyProjections,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';
import { Where } from '@potentiel-domain/entity';

export const changementReprésentantLégalAnnuléProjector = async ({
  payload: { identifiantProjet, annuléLe },
}: Lauréat.ReprésentantLégal.ChangementReprésentantLégalAnnuléEvent) => {
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
      miseÀJourLe: annuléLe,
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
