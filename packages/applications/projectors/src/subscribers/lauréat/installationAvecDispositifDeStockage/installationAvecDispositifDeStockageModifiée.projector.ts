import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const installationAvecDispositifDeStockageModifiéeProjector = async ({
  payload: { identifiantProjet, dispositifDeStockage, modifiéeLe },
}: Lauréat.InstallationAvecDispositifDeStockage.InstallationAvecDispositifDeStockageModifiéeEvent) => {
  await upsertProjection<Lauréat.InstallationAvecDispositifDeStockage.InstallationAvecDispositifDeStockageEntity>(
    `installation-avec-dispositif-de-stockage|${identifiantProjet}`,
    {
      identifiantProjet,
      dispositifDeStockage,
      miseÀJourLe: modifiéeLe,
    },
  );
};
