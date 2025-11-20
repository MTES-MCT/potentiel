import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import {
  removeProjection,
  removeProjectionWhere,
} from '@potentiel-infrastructure/pg-projection-write';

export const raccordementSuppriméV1Projector = async ({
  payload: { identifiantProjet },
}: Lauréat.Raccordement.RaccordementSuppriméEvent) => {
  await removeProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
  );

  await removeProjectionWhere<Lauréat.Raccordement.DossierRaccordementEntity>(
    'dossier-raccordement',
    {
      identifiantProjet: Where.equal(identifiantProjet),
    },
  );
};
