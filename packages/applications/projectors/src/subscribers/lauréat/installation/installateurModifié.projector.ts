import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const installateurModifiéProjector = async ({
  payload: { identifiantProjet, installateur, modifiéLe },
}: Lauréat.Installation.InstallateurModifiéEvent) => {
  await upsertProjection<Lauréat.Installation.InstallationEntity>(
    `installation|${identifiantProjet}`,
    {
      identifiantProjet,
      installateur,
      typologieInstallation: [],
      misÀJourLe: modifiéLe,
    },
  );
};
