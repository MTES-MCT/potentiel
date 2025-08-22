import { Where } from '@potentiel-domain/entity';
import type { Lauréat } from '@potentiel-domain/projet';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const délaiRebuilTriggeredProjector = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Lauréat.Délai.DemandeDélaiEntity>(`demande-délai|${id}`);

  const demandeDélai = await listProjection<Lauréat.Délai.DemandeDélaiEntity>(`demande-délai`, {
    where: { identifiantProjet: Where.equal(id) },
  });

  for (const demande of demandeDélai.items) {
    await removeProjection<Lauréat.Délai.DemandeDélaiEntity>(
      `demande-délai|${id}#${demande.demandéLe}`,
    );
  }
};
