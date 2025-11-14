import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjectionWhere } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';
import { Where } from '@potentiel-domain/entity';

export const délaiRebuildTriggeredProjector = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjectionWhere<Lauréat.Délai.DemandeDélaiEntity>('demande-délai', {
    identifiantProjet: Where.equal(id),
  });
};
