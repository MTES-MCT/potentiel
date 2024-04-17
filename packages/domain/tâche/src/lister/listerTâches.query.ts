import { Message, MessageHandler, mediator } from 'mediateur';
import * as TypeTâche from '../typeTâche.valueType';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { TâcheEntity } from '../tâche.entity';
import { RécupérerIdentifiantsProjetParEmailPorteur } from '@potentiel-domain/utilisateur';
import { ListV2, RangeOptions } from '@potentiel-domain/core';

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
  range: RangeOptions;
  total: number;
};

export type ListerTâchesQuery = Message<
  'Tâche.Query.ListerTâches',
  {
    email: string;
    appelOffre?: string;
    range?: RangeOptions;
  },
  ListerTâchesReadModel
>;

export type ListerTâchesQueryDependencies = {
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteur;
  listV2: ListV2;
};

export const registerListerTâchesQuery = ({
  listV2,
  récupérerIdentifiantsProjetParEmailPorteur,
}: ListerTâchesQueryDependencies) => {
  const handler: MessageHandler<ListerTâchesQuery> = async ({ email, range, appelOffre }) => {
    const identifiants = await récupérerIdentifiantsProjetParEmailPorteur(email);

    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await listV2<TâcheEntity>('tâche', {
      where: {
        identifiantProjet: {
          operator: 'include',
          value: identifiants,
        },
        appelOffre: appelOffre
          ? {
              operator: 'equal',
              value: appelOffre,
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
