import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const installateurImportéProjector = async ({
  payload: { identifiantProjet, installateur, importéLe },
}: Lauréat.Installation.InstallationImportéeEvent) => {
  await upsertProjection<Lauréat.Installation.InstallateurEntity>(
    `installateur|${identifiantProjet}`,
    {
      identifiantProjet,
      installateur,
      misÀJourLe: importéLe,
    },
  );
};
