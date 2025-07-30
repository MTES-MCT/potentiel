import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const tâchePlanifiéeAjoutéeProjector = async ({
  payload: { identifiantProjet, typeTâchePlanifiée, ajoutéeLe, àExécuterLe },
}: Lauréat.TâchePlanifiée.TâchePlanifiéeAjoutéeEvent) => {
  const identifiantTâche =
    typeTâchePlanifiée ===
    'représentant-légal.suppression-document-à-trois-mois' ? `${identifiantProjet}#${typeTâchePlanifiée}#${àExécuterLe}`;

  await upsertProjection<Lauréat.TâchePlanifiée.TâchePlanifiéeEntity>(
    `tâche-planifiée|${identifiantTâche}`,
    {
      identifiantProjet,
      typeTâche: typeTâchePlanifiée,
      misÀJourLe: ajoutéeLe,
      àExécuterLe,
    },
  );
};
