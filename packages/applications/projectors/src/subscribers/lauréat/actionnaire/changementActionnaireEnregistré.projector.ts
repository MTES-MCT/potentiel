import { Lauréat } from '@potentiel-domain/projet';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const changementActionnaireEnregistréProjector = async ({
  payload: {
    identifiantProjet,
    enregistréLe,
    actionnaire,
    enregistréPar,
    raison,
    pièceJustificative,
  },
}: Lauréat.Actionnaire.ChangementActionnaireEnregistréEvent) => {
  await updateOneProjection<Lauréat.Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
    {
      actionnaire: {
        nom: actionnaire,
        miseÀJourLe: enregistréLe,
      },
    },
  );

  await upsertProjection<Lauréat.Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${enregistréLe}`,
    {
      identifiantProjet,
      miseÀJourLe: enregistréLe,
      demande: {
        nouvelActionnaire: actionnaire,
        statut: Lauréat.Actionnaire.StatutChangementActionnaire.informationEnregistrée.statut,
        demandéePar: enregistréPar,
        demandéeLe: enregistréLe,
        raison,
        pièceJustificative,
      },
    },
  );
};
