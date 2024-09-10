import { List, RangeOptions, Where } from '@potentiel-domain/entity';

import { PériodeEntity } from '../période';
import { mapToReadModel } from '../consulter/consulterPériode.query';

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
  });

  return {
    items: notifiées.items.map(mapToReadModel),
    range: notifiées.range,
    total: notifiées.total,
  };
};
