import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjectionWhere } from '@potentiel-infrastructure/pg-projection-write';

import { rebuildProjection } from '../../../helpers';

export const rebuildTriggeredProjector = async ({ payload: { id } }: RebuildTriggered) => {
  await rebuildProjection<Lauréat.LauréatEntity>('lauréat', id);

  await removeProjectionWhere<Lauréat.ChangementNomProjetEntity>(`changement-nom-projet`, {
    identifiantProjet: Where.equal(id),
  });
};
