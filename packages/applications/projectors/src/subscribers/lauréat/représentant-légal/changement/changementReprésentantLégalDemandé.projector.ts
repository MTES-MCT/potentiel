import { ReprésentantLégal } from '@potentiel-domain/laureat';
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
}: ReprésentantLégal.ChangementReprésentantLégalDemandéEvent) => {
  const identifiantChangement = `${identifiantProjet}#${demandéLe}`;

  await upsertProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
    `changement-représentant-légal|${identifiantChangement}`,
    {
      identifiantProjet,
      demande: {
        statut: ReprésentantLégal.StatutChangementReprésentantLégal.demandé.formatter(),
        nomReprésentantLégal,
        typeReprésentantLégal,
        pièceJustificative,
        demandéLe,
        demandéPar,
      },
    },
  );

  await updateOneProjection<ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
    {
      demandeEnCours: { demandéLe },
    },
  );
};
