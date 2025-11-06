import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const dispositifDeStockageModifiéProjector = async ({
  payload: { identifiantProjet, modifiéLe, dispositifDeStockage },
}: Lauréat.Installation.DispositifDeStockageModifiéEvent) => {
  await updateOneProjection<Lauréat.Installation.InstallationEntity>(
    `installation|${identifiantProjet}`,
    {
      dispositifDeStockage: {
        capacitéDuDispositifDeStockageEnKWh: undefined,
        puissanceDuDispositifDeStockageEnKW: undefined,
        ...dispositifDeStockage,
      },
      miseÀJourLe: modifiéLe,
      identifiantProjet,
    },
  );
};
