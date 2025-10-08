import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const dispositifDeStockageModifiéProjector = async ({
  payload: { identifiantProjet, dispositifDeStockage, modifiéLe },
}: Lauréat.DispositifDeStockage.DispositifDeStockageModifiéEvent) => {
  await upsertProjection<Lauréat.DispositifDeStockage.DispositifDeStockageEntity>(
    `dispositif-de-stockage|${identifiantProjet}`,
    {
      identifiantProjet,
      dispositifDeStockage,
      miseÀJourLe: modifiéLe,
    },
  );
};
