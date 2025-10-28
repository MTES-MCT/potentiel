import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const installateurModifiéProjector = async ({
  payload: { identifiantProjet, installateur, modifiéLe },
}: Lauréat.Installation.InstallateurModifiéEvent) => {
  await updateOneProjection<Lauréat.Installation.InstallationEntity>(
    `installation|${identifiantProjet}`,
    {
      identifiantProjet,
      installateur,
      miseÀJourLe: modifiéLe,
    },
  );
};
