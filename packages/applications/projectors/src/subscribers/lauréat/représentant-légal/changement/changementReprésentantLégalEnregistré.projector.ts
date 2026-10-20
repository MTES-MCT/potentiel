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
      statut:
        Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.informationEnregistrée.formatter(),
      demande: {
        nomReprésentantLégal,
        typeReprésentantLégal,
        pièceJustificative,
        demandéeLe: enregistréLe,
        demandéePar: enregistréPar,
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
