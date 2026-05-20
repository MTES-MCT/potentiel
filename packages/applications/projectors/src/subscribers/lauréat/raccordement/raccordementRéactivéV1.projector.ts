import type { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const raccordementRéactivéV1Projector = async ({
  payload: { identifiantProjet },
}: Lauréat.Raccordement.RaccordementRéactivéEvent) => {
  await updateOneProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
    { désactivé: undefined },
  );
};
