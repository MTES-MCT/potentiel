import { Lauréat } from '@potentiel-domain/projet';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const changementNomProjetEnregistréProjector = async ({
  payload: {
    identifiantProjet,
    nomProjet,
    enregistréLe,
    enregistréPar,
    raison,
    pièceJustificative,
  },
}: Lauréat.ChangementNomProjetEnregistréEvent) => {
  await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    nomProjet,
  });

  await upsertProjection<Lauréat.ChangementNomProjetEntity>(
    `changement-nom-projet|${identifiantProjet}#${enregistréLe}`,
    {
      identifiantProjet,
      changement: {
        nomProjet,
        enregistréPar,
        enregistréLe,
        raison,
        pièceJustificative,
      },
    },
  );
};
