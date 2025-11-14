import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjectionWhere } from '@potentiel-infrastructure/pg-projection-write';
import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';

import { clearProjection } from '../../../helpers';

export const actionnaireRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await clearProjection<Lauréat.Actionnaire.ActionnaireEntity>(`actionnaire`, id);

  await removeProjectionWhere<Lauréat.Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire`,
    { identifiantProjet: Where.equal(id) },
  );
};
