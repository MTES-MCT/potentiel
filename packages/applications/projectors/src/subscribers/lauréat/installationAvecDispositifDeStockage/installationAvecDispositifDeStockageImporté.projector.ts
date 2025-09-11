import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const installationAvecDispositifDeStockageImportéProjector = async ({
  payload: { identifiantProjet, installationAvecDispositifDeStockage, importéeLe },
}: Lauréat.InstallationAvecDispositifDeStockage.InstallationAvecDispositifDeStockageImportéEvent) => {
  await upsertProjection<Lauréat.InstallationAvecDispositifDeStockage.InstallationAvecDispositifDeStockageEntity>(
    `installation-avec-dispositif-de-stockage|${identifiantProjet}`,
    {
      identifiantProjet,
      installationAvecDispositifDeStockage,
      miseÀJourLe: importéeLe,
    },
  );
};
