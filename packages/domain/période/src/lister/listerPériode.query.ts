import { Message, MessageHandler, mediator } from 'mediateur';

import { List, RangeOptions } from '@potentiel-domain/entity';

import { PériodeEntity } from '../période';
import { ConsulterPériodeReadModel, mapToReadModel } from '../consulter/consulterPériode.query';

export type ListerPériodesReadModel = {
  items: ReadonlyArray<ConsulterPériodeReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerPériodesQuery = Message<
  'Période.Query.ListerPériodes',
  {
    range?: RangeOptions;
  },
  ListerPériodesReadModel
>;

export type ListerPériodesDependencies = {
  list: List;
};

export const registerListerPériodesQuery = ({ list }: ListerPériodesDependencies) => {
  const handler: MessageHandler<ListerPériodesQuery> = async ({ range }) => {
    const results = await list<PériodeEntity>(`période`, { range });

    return {
      items: results.items.map(mapToReadModel),
      range: results.range,
      total: results.total,
    };
  };

  mediator.register('Période.Query.ListerPériodes', handler);
};
