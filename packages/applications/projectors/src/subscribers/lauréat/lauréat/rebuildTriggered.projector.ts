import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjectionWhere } from '@potentiel-infrastructure/pg-projection-write';

import { clearProjection } from '../../../helpers';

export const lauréatRebuildTriggeredProjector = async ({ payload: { id } }: RebuildTriggered) => {
  await clearProjection<Lauréat.LauréatEntity>('lauréat', id);

  await removeProjectionWhere<Lauréat.ChangementNomProjetEntity>(`changement-nom-projet`, {
    identifiantProjet: Where.equal(id),
  });
};
