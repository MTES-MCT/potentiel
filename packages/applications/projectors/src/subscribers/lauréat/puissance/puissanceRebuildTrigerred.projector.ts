import { Where } from '@potentiel-domain/entity';
import type { Lauréat } from '@potentiel-domain/projet';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjectionWhere } from '@potentiel-infrastructure/pg-projection-write';

import { clearProjection } from '../../../helpers/index.js';

export const puissanceRebuildTriggeredProjector = async ({ payload: { id } }: RebuildTriggered) => {
  await clearProjection<Lauréat.Puissance.PuissanceEntity>('puissance', id);

  await removeProjectionWhere<Lauréat.Puissance.ChangementPuissanceEntity>('changement-puissance', {
    identifiantProjet: Where.equal(id),
  });
};
