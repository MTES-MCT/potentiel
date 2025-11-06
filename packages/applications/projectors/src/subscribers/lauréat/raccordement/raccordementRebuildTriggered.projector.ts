import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjectionWhere } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';
import { Where } from '@potentiel-domain/entity';

import { rebuildProjection } from '../../../helpers';

export const raccordementRebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await rebuildProjection<Lauréat.Raccordement.RaccordementEntity>('raccordement', id);

  await removeProjectionWhere<Lauréat.Raccordement.DossierRaccordementEntity>(
    'dossier-raccordement',
    {
      identifiantProjet: Where.equal(id),
    },
  );
};
