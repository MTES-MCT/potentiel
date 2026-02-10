import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { List, RangeOptions, Where } from '@potentiel-domain/entity';

import { TâchePlanifiéeEntity } from '../tâchePlanifiée.entity.js';
import { IdentifiantProjet } from '../../../index.js';

type TâchePlanifiéeListItem = {
  identifiantProjet: IdentifiantProjet.ValueType;

  typeTâchePlanifiée: string;
  miseÀJourLe: DateTime.ValueType;
  àExécuterLe: DateTime.ValueType;
};

export type ListerTâchesPlanifiéesReadModel = {
  items: Array<TâchePlanifiéeListItem>;
  range: RangeOptions;
  total: number;
};

export type ListerTâchesPlanifiéesQuery = Message<
  'Tâche.Query.ListerTâchesPlanifiées',
  {
    range?: RangeOptions;
    catégorieTâche?: string;
    àExécuterLe?: string;
  },
  ListerTâchesPlanifiéesReadModel
>;

export type ListerTâchesPlanifiéesQueryDependencies = {
  list: List;
};

export const registerListerTâchesPlanifiéesQuery = ({
  list,
}: ListerTâchesPlanifiéesQueryDependencies) => {
  const handler: MessageHandler<ListerTâchesPlanifiéesQuery> = async ({
    range,
    catégorieTâche,
    àExécuterLe,
  }) => {
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<TâchePlanifiéeEntity>('tâche-planifiée', {
      where: {
        typeTâche: Where.startWith(catégorieTâche ? `${catégorieTâche}.` : undefined),
        àExécuterLe: Where.startWith(
          àExécuterLe
            ? `${DateTime.convertirEnValueType(àExécuterLe).formatterDate()}T`
            : undefined,
        ),
      },
      range,
    });

    return {
      items: items.map(mapToReadModel),
      range: {
        endPosition,
        startPosition,
      },
      total,
    };
  };
  mediator.register('Tâche.Query.ListerTâchesPlanifiées', handler);
};

const mapToReadModel = ({
  identifiantProjet,
  miseÀJourLe,
  typeTâche,
  àExécuterLe,
}: TâchePlanifiéeEntity): TâchePlanifiéeListItem => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    miseÀJourLe: DateTime.convertirEnValueType(miseÀJourLe),
    àExécuterLe: DateTime.convertirEnValueType(àExécuterLe),
    typeTâchePlanifiée: typeTâche,
  };
};
