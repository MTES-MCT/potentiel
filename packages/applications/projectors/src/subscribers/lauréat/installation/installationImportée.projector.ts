import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const installationImportéeProjector = async ({
  payload: { identifiantProjet, installateur, typologieDuProjet, importéeLe },
}: Lauréat.Installation.InstallationImportéeEvent) => {
  await upsertProjection<Lauréat.Installation.InstallationEntity>(
    `installation|${identifiantProjet}`,
    {
      identifiantProjet,
      installateur,
      typologieDuProjet,
      misÀJourLe: importéeLe,
    },
  );
};
