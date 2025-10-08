import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const dispositifDeStockageImportéProjector = async ({
  payload: { identifiantProjet, dispositifDeStockage, importéLe },
}: Lauréat.DispositifDeStockage.DispositifDeStockageImportéEvent) => {
  await upsertProjection<Lauréat.DispositifDeStockage.DispositifDeStockageEntity>(
    `dispositif-de-stockage|${identifiantProjet}`,
    {
      identifiantProjet,
      dispositifDeStockage,
      miseÀJourLe: importéLe,
    },
  );
};
