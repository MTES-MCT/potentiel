import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const raccordementDésactivéV1Projector = async ({
  payload: { identifiantProjet },
}: Lauréat.Raccordement.RaccordementDésactivéEvent) => {
  await updateOneProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
    {
      désactivé: true,
    },
  );
};
