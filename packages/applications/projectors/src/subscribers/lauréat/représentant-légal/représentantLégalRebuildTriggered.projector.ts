import { Where } from '@potentiel-domain/entity';
import type { Lauréat } from '@potentiel-domain/projet';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjectionWhere } from '@potentiel-infrastructure/pg-projection-write';

import { clearProjection } from '../../../helpers/index.js';

export const représentantLégalRebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await clearProjection<Lauréat.ReprésentantLégal.ReprésentantLégalEntity>(
    'représentant-légal',
    id,
  );

  await removeProjectionWhere<Lauréat.ReprésentantLégal.ChangementReprésentantLégalEntity>(
    'changement-représentant-légal',
    { identifiantProjet: Where.equal(id) },
  );
};
