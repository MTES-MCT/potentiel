import type { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const achèvementInitiéProjector = async ({
  payload: { identifiantProjet, initiéLe, initiéPar },
}: Lauréat.Achèvement.AchèvementInitiéEvent) => {
  await updateOneProjection<Lauréat.Achèvement.AchèvementEntity>(
    `achèvement|${identifiantProjet}`,
    {
      initiation: { initiéLe, initiéPar },
    },
  );
};
