import { Lauréat } from '@potentiel-domain/projet';
import { updateManyProjections } from '@potentiel-infrastructure/pg-projection-write';
import { Where } from '@potentiel-domain/entity';

export const changementReprésentantLégalCorrigéProjector = async ({
  payload: {
    identifiantProjet,
    nomReprésentantLégal,
    typeReprésentantLégal,
    pièceJustificative,
    corrigéLe,
  },
}: Lauréat.ReprésentantLégal.ChangementReprésentantLégalCorrigéEvent) => {
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
      miseÀJourLe: corrigéLe,
      demande: {
        nomReprésentantLégal,
        typeReprésentantLégal,
        ...(pièceJustificative && {
          pièceJustificative,
        }),
      },
    },
  );
};
