import { Lauréat } from '@potentiel-domain/projet';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const changementReprésentantLégalDemandéProjector = async ({
  payload: {
    identifiantProjet,
    nomReprésentantLégal,
    typeReprésentantLégal,
    pièceJustificative,
    demandéLe,
    demandéPar,
  },
}: Lauréat.ReprésentantLégal.ChangementReprésentantLégalDemandéEvent) => {
  const identifiantChangement = `${identifiantProjet}#${demandéLe}`;

  await upsertProjection<Lauréat.ReprésentantLégal.ChangementReprésentantLégalEntity>(
    `changement-représentant-légal|${identifiantChangement}`,
    {
      identifiantProjet,
      miseÀJourLe: demandéLe,
      demande: {
        statut: Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.demandé.formatter(),
        nomReprésentantLégal,
        typeReprésentantLégal,
        pièceJustificative,
        demandéLe,
        demandéPar,
      },
    },
  );

  await updateOneProjection<Lauréat.ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
    {
      demandeEnCours: { demandéLe },
    },
  );
};
