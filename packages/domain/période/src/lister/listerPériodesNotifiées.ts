import { type List, type RangeOptions, Where } from '@potentiel-domain/entity';

import { mapToReadModel } from '../consulter/consulterPériode.query';
import type { PériodeEntity } from '../période';

export const listerPériodesNotifiées = async (
  list: List,
  range: RangeOptions | undefined,
  appelOffre: string | undefined,
) => {
  const notifiées = await list<PériodeEntity>(`période`, {
    range,
    where: {
      appelOffre: Where.equal(appelOffre),
    },
    orderBy: {
      notifiéeLe: 'descending',
    },
  });

  return {
    items: notifiées.items.map(mapToReadModel),
    range: notifiées.range,
    total: notifiées.total,
  };
};
