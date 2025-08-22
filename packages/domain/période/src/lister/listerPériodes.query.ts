import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { List, RangeOptions } from '@potentiel-domain/entity';

import type { ConsulterPériodeReadModel } from '../consulter/consulterPériode.query';
import { listerPériodesNonNotifiées } from './listerPériodesNonNotifiées';
import { listerPériodesNotifiées } from './listerPériodesNotifiées';
import { listerToutesLesPériodes } from './listerToutesLesPériodes';

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
  }) => {
    if (estNotifiée === true) {
      return await listerPériodesNotifiées(list, range, appelOffre);
    }

    if (estNotifiée === false) {
      return await listerPériodesNonNotifiées(list, range, appelOffre);
    }

    return await listerToutesLesPériodes(list, range, appelOffre);
  };

  mediator.register('Période.Query.ListerPériodes', handler);
};
