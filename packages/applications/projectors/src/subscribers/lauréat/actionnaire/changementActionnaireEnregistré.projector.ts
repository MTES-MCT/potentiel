import { Actionnaire } from '@potentiel-domain/laureat';
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
}: Actionnaire.ChangementActionnaireEnregistréEvent) => {
  await updateOneProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    actionnaire: {
      nom: actionnaire,
      misÀJourLe: enregistréLe,
    },
  });

  await upsertProjection<Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${enregistréLe}`,
    {
      identifiantProjet,
      demande: {
        nouvelActionnaire: actionnaire,
        statut: Actionnaire.StatutChangementActionnaire.informationEnregistrée.statut,
        demandéePar: enregistréPar,
        demandéeLe: enregistréLe,
        raison,
        pièceJustificative,
      },
    },
  );
};
