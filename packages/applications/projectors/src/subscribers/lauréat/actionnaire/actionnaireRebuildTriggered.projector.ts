import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  removeProjection,
  removeProjectionWhere,
} from '@potentiel-infrastructure/pg-projection-write';
import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';

export const actionnaireRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Lauréat.Actionnaire.ActionnaireEntity>(`actionnaire|${id}`);

  await removeProjectionWhere<Lauréat.Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire`,
    { identifiantProjet: Where.equal(id) },
  );
};
