import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const installationAvecDispositifDeStockageModifiéProjector = async ({
  payload: { identifiantProjet, installationAvecDispositifDeStockage, modifiéeLe },
}: Lauréat.InstallationAvecDispositifDeStockage.InstallationAvecDispositifDeStockageModifiéEvent) => {
  await upsertProjection<Lauréat.InstallationAvecDispositifDeStockage.InstallationAvecDispositifDeStockageEntity>(
    `installation-avec-dispositif-de-stockage|${identifiantProjet}`,
    {
      identifiantProjet,
      installationAvecDispositifDeStockage,
      miseÀJourLe: modifiéeLe,
    },
  );
};
