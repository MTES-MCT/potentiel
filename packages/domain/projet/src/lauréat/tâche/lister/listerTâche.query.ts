import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { List, RangeOptions, Where, Joined } from '@potentiel-domain/entity';

import { TâcheEntity } from '../tâche.entity.js';
import * as TypeTâche from '../typeTâche.valueType.js';
import { GetScopeProjetUtilisateur, IdentifiantProjet } from '../../../index.js';
import { LauréatEntity } from '../../index.js';

type TâcheListItem = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  typeTâche: TypeTâche.ValueType;
  miseÀJourLe: DateTime.ValueType;
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
    appelOffre?: Array<string>;
    range?: RangeOptions;
    catégorieTâche?: string;
    cycle?: string;
    nomProjet?: string;
    identifiantProjet?: IdentifiantProjet.RawType;
  },
  ListerTâchesReadModel
>;

export type ListerTâchesQueryDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
};

export const registerListerTâchesQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerTâchesQueryDependencies) => {
  const handler: MessageHandler<ListerTâchesQuery> = async ({
    email,
    range,
    appelOffre,
    catégorieTâche,
    cycle,
    nomProjet,
    identifiantProjet,
  }) => {
    const scope = identifiantProjet
      ? {
          type: 'projet',
          identifiantProjets: [identifiantProjet],
        }
      : await getScopeProjetUtilisateur(Email.convertirEnValueType(email));

    if (scope.type !== 'projet') {
      return {
        items: [],
        range: {
          startPosition: 0,
          endPosition: 0,
        },
        total: 0,
      };
    }

    // viovio
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<TâcheEntity, LauréatEntity>('tâche', {
      where: {
        identifiantProjet: Where.matchAny(scope.identifiantProjets),
        typeTâche: Where.startWith(catégorieTâche ? `${catégorieTâche}.` : undefined),
      },
      range,
      // Ici on join avec Lauréat car seuls les Lauréats peuvent avoir des tâches actuellement
      // si cela venait à changer, il faudrait modifier cela
      join: {
        entity: 'lauréat',
        on: 'identifiantProjet',
        where: {
          appelOffre:
            appelOffre && appelOffre.length > 0
              ? Where.matchAny(appelOffre)
              : cycle
                ? cycle === 'PPE2'
                  ? Where.like('PPE2')
                  : Where.notLike('PPE2')
                : undefined,
          nomProjet: Where.like(nomProjet),
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
  miseÀJourLe,
  typeTâche,
  lauréat: { nomProjet },
}: TâcheEntity & Joined<LauréatEntity>): TâcheListItem => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  miseÀJourLe: DateTime.convertirEnValueType(miseÀJourLe),
  typeTâche: TypeTâche.convertirEnValueType(typeTâche),
  nomProjet,
});
