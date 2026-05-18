import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjectionWhere } from '@potentiel-infrastructure/pg-projection-write';

export const délaiRebuildTriggeredProjector = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjectionWhere<Lauréat.Délai.DemandeDélaiEntity>('demande-délai', {
    identifiantProjet: Where.equal(id),
  });
};
