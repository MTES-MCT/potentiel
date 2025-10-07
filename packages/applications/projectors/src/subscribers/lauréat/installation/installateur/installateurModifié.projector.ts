import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const installateurModifiéProjector = async ({
  payload: { identifiantProjet, installateur, modifiéLe },
}: Lauréat.Installation.InstallateurModifiéEvent) => {
  await upsertProjection<Lauréat.Installation.InstallateurEntity>(
    `installateur|${identifiantProjet}`,
    {
      identifiantProjet,
      installateur,
      misÀJourLe: modifiéLe,
    },
  );
};
