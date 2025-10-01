import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';

export const dispositifDeStockageRebuilTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await removeProjection<Lauréat.DispositifDeStockage.DispositifDeStockageEntity>(
    `dispositif-de-stockage|${id}`,
  );
};
