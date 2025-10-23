import { Message, MessageHandler, mediator } from 'mediateur';

import { List, RangeOptions, Where } from '@potentiel-domain/entity';

import { ConsulterPériodeReadModel, mapToReadModel } from '../consulter/consulterPériode.query';
import { PériodeEntity } from '../période.entity';
import { IdentifiantPériode } from '../période';

export type ListerPériodeItemReadModel = ConsulterPériodeReadModel;

export type ListerPériodesReadModel = {
  items: ReadonlyArray<ListerPériodeItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerPériodesQuery = Message<
  'Période.Query.ListerPériodes',
  {
    appelOffre?: string;
    estNotifiée?: boolean;
    range?: RangeOptions;
    identifiantsPériodes?: Array<IdentifiantPériode.RawType>;
  },
  ListerPériodesReadModel
>;

export type ListerPériodesDependencies = {
  list: List;
};

export const registerListerPériodesQuery = ({ list }: ListerPériodesDependencies) => {
  const handler: MessageHandler<ListerPériodesQuery> = async ({
    range,
    estNotifiée,
    appelOffre,
    identifiantsPériodes,
  }) => {
    const notifiées = await list<PériodeEntity>(`période`, {
      range,
      where: {
        identifiantPériode: Where.matchAny(identifiantsPériodes),
        appelOffre: Where.equal(appelOffre),
        estNotifiée: Where.equal(estNotifiée),
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

  mediator.register('Période.Query.ListerPériodes', handler);
};
