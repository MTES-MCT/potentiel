import { Message, MessageHandler, mediator } from 'mediateur';
import { match, Pattern } from 'ts-pattern';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { RécupérerIdentifiantsProjetParEmailPorteurPort } from '@potentiel-domain/utilisateur';
import { List, RangeOptions, Where } from '@potentiel-domain/entity';

import { TâcheEntity } from '../tâche.entity';
import * as TypeTâche from '../typeTâche.valueType';

type TâcheListItem = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  typeTâche: TypeTâche.ValueType;
  misÀJourLe: DateTime.ValueType;
};

export type ListerTâchesReadModel = {
  items: Array<TâcheListItem>;
  range: RangeOptions;
  total: number;
};

export type ListerTâchesQuery = Message<
  'Tâche.Query.ListerTâches',
  {
    email: string;
    appelOffre?: string;
    range?: RangeOptions;
    catégorieTâche?: string;
    cycle?: string;
    nomProjet?: string;
  },
  ListerTâchesReadModel
>;

export type ListerTâchesQueryDependencies = {
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteurPort;
  list: List;
};

export const registerListerTâchesQuery = ({
  list,
  récupérerIdentifiantsProjetParEmailPorteur,
}: ListerTâchesQueryDependencies) => {
  const handler: MessageHandler<ListerTâchesQuery> = async ({
    email,
    range,
    appelOffre,
    catégorieTâche,
    cycle,
    nomProjet,
  }) => {
    const identifiants = await récupérerIdentifiantsProjetParEmailPorteur(email);

    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<TâcheEntity>('tâche', {
      where: {
        identifiantProjet: Where.include(identifiants),
        projet: {
          appelOffre: cycle
            ? cycle === 'PPE2'
              ? Where.contains('PPE2')
              : Where.notContains('PPE2')
            : Where.equal(appelOffre),
          nom: Where.contains(nomProjet),
        },
        typeTâche: Where.startWith(catégorieTâche ? `${catégorieTâche}.` : undefined),
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
  mediator.register('Tâche.Query.ListerTâches', handler);
};

const mapToReadModel = ({
  identifiantProjet,
  misÀJourLe,
  typeTâche,
  projet,
}: TâcheEntity): TâcheListItem => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    misÀJourLe: DateTime.convertirEnValueType(misÀJourLe),
    typeTâche: TypeTâche.convertirEnValueType(typeTâche),
    nomProjet: match(projet)
      .with(Pattern.nullish, () => '')
      .otherwise(({ nom }) => nom),
  };
};
