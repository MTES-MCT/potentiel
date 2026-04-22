import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const raccordementSuppriméV1Projector = async ({
  payload: { identifiantProjet },
}: Lauréat.Raccordement.RaccordementSuppriméEvent) => {
  await updateOneProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
    { désactivé: true },
  );
};
