import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjectionWhere } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';
import { Where } from '@potentiel-domain/entity';

import { clearProjection } from '../../../helpers';

export const producteurRebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await clearProjection<Lauréat.Producteur.ProducteurEntity>(`producteur`, id);

  await removeProjectionWhere<Lauréat.Producteur.ChangementProducteurEntity>(
    `changement-producteur`,
    { identifiantProjet: Where.equal(id) },
  );
};
