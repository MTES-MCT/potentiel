import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const installateurModifiéProjector = async ({
  payload: { identifiantProjet, installateur, modifiéLe },
}: Lauréat.Installateur.InstallateurModifiéEvent) => {
  await upsertProjection<Lauréat.Installateur.InstallateurEntity>(
    `installateur|${identifiantProjet}`,
    {
      identifiantProjet,
      installateur,
      misÀJourLe: modifiéLe,
    },
  );
};
