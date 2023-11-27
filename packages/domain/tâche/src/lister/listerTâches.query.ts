import { Message, MessageHandler, mediator } from 'mediateur';
import * as TypeTâche from '../typeTâche.valueType';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { List } from '@potentiel-libraries/projection';
import { TâcheProjection } from '../tâche.projection';

type TâcheListItem = {
  identifiantProjet: IdentifiantProjet.ValueType;

  nomProjet: string;
  appelOffre: string;
  période: string;
  famille?: string;
  numéroCRE: string;

  typeTâche: TypeTâche.ValueType;
  misÀJourLe: DateTime.ValueType;
};

export type ListerTâcheReadModel = {
  items: Array<TâcheListItem>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
};

export type ListerTâcheQuery = Message<
  'LISTER_TÂCHES_QUERY',
  {
    identifiantProjet: string;
  },
  ListerTâcheReadModel
>;

export type ListerTâcheQueryDependencies = {
  list: List;
};

export const registerListerTâcheQuery = ({ list }: ListerTâcheQueryDependencies) => {
  const handler: MessageHandler<ListerTâcheQuery> = async ({ identifiantProjet }) => {
    const result = await list<TâcheProjection>({
      type: 'tâche',
      where: {
        identifiantProjet,
      },
      orderBy: {
        property: 'misÀJourLe',
        ascending: false,
      },
    });
    return {
      ...result,
      items: result.items.map(mapToReadModel),
    };
  };
  mediator.register('LISTER_TÂCHES_QUERY', handler);
};

const mapToReadModel = ({
  appelOffre,
  identifiantProjet,
  misÀJourLe,
  nomProjet,
  numéroCRE,
  période,
  typeTâche,
  famille,
}: TâcheProjection): TâcheListItem => {
  return {
    appelOffre,
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    misÀJourLe: DateTime.convertirEnValueType(misÀJourLe),
    nomProjet,
    numéroCRE,
    période,
    famille,
    typeTâche: TypeTâche.convertirEnValueType(typeTâche),
  };
};
