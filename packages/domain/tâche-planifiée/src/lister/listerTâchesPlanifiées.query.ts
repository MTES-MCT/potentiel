import { Message, MessageHandler, mediator } from 'mediateur';
import { match, Pattern } from 'ts-pattern';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { List, RangeOptions } from '@potentiel-domain/entity';

import { TâchePlanifiéeEntity } from '../tâchePlanifiée.entity';

type TâchePlanifiéeListItem = {
  identifiantProjet: IdentifiantProjet.ValueType;

  typeTâchePlanifiée: string;
  misÀJourLe: DateTime.ValueType;
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
        typeTâche: match(catégorieTâche)
          .with(Pattern.nullish, () => undefined)
          .otherwise((value) => ({
            operator: 'like',
            value: `${value}.%`,
          })),
        àExécuterLe: àExécuterLe
          ? {
              operator: 'like',
              // get only the date part, ignore the time
              value: `${DateTime.convertirEnValueType(àExécuterLe).formatterDate()}T%`,
            }
          : undefined,
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
  misÀJourLe,
  typeTâche,
  àExécuterLe,
}: TâchePlanifiéeEntity): TâchePlanifiéeListItem => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    misÀJourLe: DateTime.convertirEnValueType(misÀJourLe),
    àExécuterLe: DateTime.convertirEnValueType(àExécuterLe),
    typeTâchePlanifiée: typeTâche,
  };
};
