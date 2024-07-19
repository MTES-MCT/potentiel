import { Message, MessageHandler, mediator } from 'mediateur';
import { match, Pattern } from 'ts-pattern';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { List, RangeOptions } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import { TâchePlanifiéeEntity } from '../tâche.entity';
import * as TypeTâche from '../typeTâche.valueType';

type TâchePlanifiéeListItem = {
  identifiantProjet: IdentifiantProjet.ValueType;

  typeTâche: TypeTâche.ValueType;
  misÀJourLe: DateTime.ValueType;
  àExecuterLe: Option.Type<DateTime.ValueType>;
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
    àExecuterLe: string;
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
    àExecuterLe,
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
        àExecuterLe: {
          operator: 'like',
          // get only the date part, ignore the time
          value: `${DateTime.convertirEnValueType(àExecuterLe).formatterDate()}T%`,
        },
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
  àExecuterLe,
}: TâchePlanifiéeEntity): TâchePlanifiéeListItem => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    misÀJourLe: DateTime.convertirEnValueType(misÀJourLe),
    àExecuterLe: DateTime.convertirEnValueType(àExecuterLe),
    typeTâche: TypeTâche.convertirEnValueType(typeTâche),
  };
};
