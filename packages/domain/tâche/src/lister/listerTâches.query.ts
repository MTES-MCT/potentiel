import { Message, MessageHandler, mediator } from 'mediateur';
import { match, Pattern } from 'ts-pattern';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { RécupérerIdentifiantsProjetParEmailPorteur } from '@potentiel-domain/utilisateur';
import { List, RangeOptions } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import { TâcheEntity } from '../tâche.entity';
import * as TypeTâche from '../typeTâche.valueType';

type TâcheListItem = {
  identifiantProjet: IdentifiantProjet.ValueType;

  projet: Option.Type<{
    nom: string;
    appelOffre: string;
    période: string;
    famille: Option.Type<string>;
    numéroCRE: string;
  }>;

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
    typeTâches?: string[];
  },
  ListerTâchesReadModel
>;

export type ListerTâchesQueryDependencies = {
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteur;
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
    typeTâches,
  }) => {
    const identifiants = await récupérerIdentifiantsProjetParEmailPorteur(email);

    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<TâcheEntity>('tâche', {
      where: {
        identifiantProjet: {
          operator: 'include',
          value: identifiants,
        },
        projet: match(appelOffre)
          .with(Pattern.nullish, () => undefined)
          .otherwise((value) => ({
            appelOffre: {
              operator: 'equal',
              value: value,
            },
          })),
        typeTâche: match(typeTâches)
          .with(Pattern.nullish, () => undefined)
          .otherwise((value) => ({
            operator: 'include',
            value: value,
          })),
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
    projet: match(projet)
      .returnType<Option.Type<TâcheListItem['projet']>>()
      .with(Pattern.nullish, () => Option.none)
      .otherwise(({ appelOffre, nom, numéroCRE, période, famille }) => ({
        appelOffre,
        nom,
        numéroCRE,
        période,
        famille: match(famille)
          .returnType<Option.Type<string>>()
          .with(Pattern.nullish, () => Option.none)
          .otherwise((value) => value),
      })),
  };
};
