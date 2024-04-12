import { Message, MessageHandler, mediator } from 'mediateur';
import * as TypeTâche from '../typeTâche.valueType';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { TâcheEntity } from '../tâche.entity';

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

export type ListerTâchesReadModel = {
  items: Array<TâcheListItem>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
};

export type ListerTâchesQuery = Message<
  'Tâche.Query.ListerTâches',
  {
    email: string;
    appelOffre?: string;
    pagination: { page: number; itemsPerPage: number };
  },
  ListerTâchesReadModel
>;

export type RécupérerTâchesPort = (
  email: string,
  filters: {
    appelOffre?: string;
  },
  pagination: {
    page: number;
    itemsPerPage: number;
  },
) => Promise<{
  items: ReadonlyArray<TâcheEntity>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}>;

export type ListerTâchesQueryDependencies = {
  récupérerTâches: RécupérerTâchesPort;
};

export const registerListerTâchesQuery = ({ récupérerTâches }: ListerTâchesQueryDependencies) => {
  const handler: MessageHandler<ListerTâchesQuery> = async ({ email, pagination, appelOffre }) => {
    const { items, currentPage, itemsPerPage, totalItems } = await récupérerTâches(
      email,
      {
        appelOffre,
      },
      pagination,
    );
    return {
      items: items.map(mapToReadModel),
      currentPage,
      itemsPerPage,
      totalItems,
    };
  };
  mediator.register('Tâche.Query.ListerTâches', handler);
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
}: TâcheEntity): TâcheListItem => {
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
