import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const tâchePlanifiéeAjoutéeProjector = async ({
  payload: { identifiantProjet, typeTâchePlanifiée, ajoutéeLe, àExécuterLe },
}: Lauréat.TâchePlanifiée.TâchePlanifiéeAjoutéeEvent) => {
  await upsertProjection<Lauréat.TâchePlanifiée.TâchePlanifiéeEntity>(
    `tâche-planifiée|${typeTâchePlanifiée}#${identifiantProjet}`,
    {
      identifiantProjet,
      typeTâche: typeTâchePlanifiée,
      misÀJourLe: ajoutéeLe,
      àExécuterLe,
    },
  );
};
