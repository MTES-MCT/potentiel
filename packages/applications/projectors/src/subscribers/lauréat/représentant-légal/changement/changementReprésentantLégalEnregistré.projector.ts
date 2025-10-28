import { Lauréat } from '@potentiel-domain/projet';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const changementReprésentantLégalEnregistréProjector = async ({
  payload: {
    identifiantProjet,
    nomReprésentantLégal,
    typeReprésentantLégal,
    pièceJustificative,
    enregistréLe,
    enregistréPar,
  },
}: Lauréat.ReprésentantLégal.ChangementReprésentantLégalEnregistréEvent) => {
  const identifiantChangement = `${identifiantProjet}#${enregistréLe}`;

  await upsertProjection<Lauréat.ReprésentantLégal.ChangementReprésentantLégalEntity>(
    `changement-représentant-légal|${identifiantChangement}`,
    {
      identifiantProjet,
      miseÀJourLe: enregistréLe,
      demande: {
        statut:
          Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.informationEnregistrée.formatter(),
        nomReprésentantLégal,
        typeReprésentantLégal,
        pièceJustificative,
        demandéLe: enregistréLe,
        demandéPar: enregistréPar,
      },
    },
  );

  await updateOneProjection<Lauréat.ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
    {
      nomReprésentantLégal,
      typeReprésentantLégal,
    },
  );
};
