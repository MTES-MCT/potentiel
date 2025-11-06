import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Where } from '@potentiel-domain/entity';
import { removeProjectionWhere } from '@potentiel-infrastructure/pg-projection-write';

import { rebuildProjection } from '../../../helpers';

export const représentantLégalRebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await rebuildProjection<Lauréat.ReprésentantLégal.ReprésentantLégalEntity>(
    'représentant-légal',
    id,
  );

  await removeProjectionWhere<Lauréat.ReprésentantLégal.ChangementReprésentantLégalEntity>(
    'changement-représentant-légal',
    { identifiantProjet: Where.equal(id) },
  );
};
