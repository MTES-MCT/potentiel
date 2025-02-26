import {
  TâchePlanifiéeAjoutéeEvent,
  TâchePlanifiéeEntity,
} from '@potentiel-domain/tache-planifiee';

import { upsertProjection } from '../../../infrastructure';

export const tâchePlanifiéeAjoutéeProjector = async ({
  payload: { identifiantProjet, typeTâchePlanifiée, ajoutéeLe, àExécuterLe },
}: TâchePlanifiéeAjoutéeEvent) => {
  await upsertProjection<TâchePlanifiéeEntity>(
    `tâche-planifiée|${typeTâchePlanifiée}#${identifiantProjet}`,
    {
      identifiantProjet,
      typeTâche: typeTâchePlanifiée,
      misÀJourLe: ajoutéeLe,
      àExécuterLe: àExécuterLe,
    },
  );
};
