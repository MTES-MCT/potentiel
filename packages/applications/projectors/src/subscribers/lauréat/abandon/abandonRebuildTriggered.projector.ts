import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjectionWhere } from '@potentiel-infrastructure/pg-projection-write';

import { clearProjection } from '../../../helpers';

export const abandonRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await clearProjection<Lauréat.Abandon.AbandonEntity>(`abandon`, id);
  await removeProjectionWhere<Lauréat.Abandon.DemandeAbandonEntity>('demande-abandon', {
    identifiantProjet: Where.equal(id),
  });
};
