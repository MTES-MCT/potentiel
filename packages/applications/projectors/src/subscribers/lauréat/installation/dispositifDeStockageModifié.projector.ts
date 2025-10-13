import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

export const dispositifDeStockageModifiéProjector = async ({
  payload: { identifiantProjet, modifiéLe, dispositifDeStockage },
}: Lauréat.Installation.DispositifDeStockageModifiéEvent) => {
  const projectionToUpsert = await findProjection<Lauréat.Installation.InstallationEntity>(
    `installation|${identifiantProjet}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error(`Installation non trouvée`, {
      identifiantProjet,
      fonction: 'dispositifDeStockageModifiéProjector',
    });
    return;
  }

  await upsertProjection<Lauréat.Installation.InstallationEntity>(
    `installation|${identifiantProjet}`,
    {
      ...projectionToUpsert,
      dispositifDeStockage,
      misÀJourLe: modifiéLe,
      identifiantProjet,
    },
  );
};
