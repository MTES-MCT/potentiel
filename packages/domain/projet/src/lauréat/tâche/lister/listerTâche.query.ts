import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { RécupérerIdentifiantsProjetParEmailPorteurPort } from '@potentiel-domain/utilisateur';
import { List, RangeOptions, Where, Joined } from '@potentiel-domain/entity';

import { TâcheEntity } from '../tâche.entity';
import * as TypeTâche from '../typeTâche.valueType';
import { IdentifiantProjet } from '../../..';
import { LauréatEntity } from '../..';

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
    } = await list<TâcheEntity, LauréatEntity>('tâche', {
      where: {
        identifiantProjet: Where.matchAny(identifiants),
        typeTâche: Where.startWith(catégorieTâche ? `${catégorieTâche}.` : undefined),
      },
      range,
      // Ici on join avec Lauréat car seuls les Lauréats peuvent avoir des tâches actuellement
      // si cela venait à changer, il faudrait modifier cela
      join: {
        entity: 'lauréat',
        on: 'identifiantProjet',
        where: {
          appelOffre: cycle
            ? cycle === 'PPE2'
              ? Where.contain('PPE2')
              : Where.notContains('PPE2')
            : Where.equal(appelOffre),
          nomProjet: Where.contain(nomProjet),
        },
      },
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
  lauréat: { nomProjet },
}: TâcheEntity & Joined<LauréatEntity>): TâcheListItem => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    misÀJourLe: DateTime.convertirEnValueType(misÀJourLe),
    typeTâche: TypeTâche.convertirEnValueType(typeTâche),
    nomProjet,
  };
};
