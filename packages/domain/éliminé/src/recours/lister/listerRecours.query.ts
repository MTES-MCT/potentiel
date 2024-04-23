import { Message, MessageHandler, mediator } from 'mediateur';
import { RecoursEntity } from '../recours.entity';
import { DateTime, IdentifiantProjet, CommonPort } from '@potentiel-domain/common';
import { StatutRecours } from '..';
import { Option } from '@potentiel-libraries/monads';
import { ListResultV2, ListV2, RangeOptions } from '@potentiel-domain/core';

type RecoursListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: string;
  période: string;
  famille?: string;
  nomProjet: string;
  statut: StatutRecours.ValueType;
  misÀJourLe: DateTime.ValueType;
};

export type ListerRecoursReadModel = {
  items: ReadonlyArray<RecoursListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerRecoursQuery = Message<
  'Eliminé.Recours.Query.ListerRecours',
  {
    utilisateur: {
      rôle: string;
      email: string;
    };
    statut?: StatutRecours.RawType;
    appelOffre?: string;
    range?: RangeOptions;
  },
  ListerRecoursReadModel
>;

export type ListerRecoursDependencies = {
  list: ListV2;
  listerProjetsAccessibles: CommonPort.ListerIdentifiantsProjetsAccessiblesPort;
  récupérerRégionDreal: CommonPort.RécupérerRégionDrealPort;
};

export const registerListerRecoursQuery = ({
  list,
  listerProjetsAccessibles,
  récupérerRégionDreal,
}: ListerRecoursDependencies) => {
  const handler: MessageHandler<ListerRecoursQuery> = async ({
    statut,
    appelOffre,
    utilisateur: { email, rôle },
    range,
  }) => {
    let recours: ListResultV2<RecoursEntity>;

    if (['admin', 'dgec-validateur', 'cre'].includes(rôle)) {
      recours = await list<RecoursEntity>('recours', {
        orderBy: { misÀJourLe: 'descending' },
        range,
        where: {
          statut: statut ? { operator: 'equal', value: statut } : undefined,
          appelOffre: appelOffre ? { operator: 'equal', value: appelOffre } : undefined,
        },
      });
    } else if (rôle === 'dreal') {
      const région = await récupérerRégionDreal(email);
      if (Option.isNone(région)) {
        return {
          items: [],
          range: { startPosition: 0, endPosition: 0 },
          total: 0,
        };
      }

      recours = await list<RecoursEntity>('recours', {
        orderBy: { misÀJourLe: 'descending' },
        range,
        where: {
          statut: statut ? { operator: 'equal', value: statut } : undefined,
          appelOffre: appelOffre ? { operator: 'equal', value: appelOffre } : undefined,
          régionProjet: { operator: 'equal', value: région.région },
        },
      });
    } else {
      const identifiantsProjets = await listerProjetsAccessibles(email);

      recours = await list<RecoursEntity>('recours', {
        orderBy: { misÀJourLe: 'descending' },
        range,
        where: {
          identifiantProjet: {
            operator: 'include',
            value: identifiantsProjets.map(
              ({ appelOffre, période, famille, numéroCRE }) =>
                `${appelOffre}#${période}#${famille}#${numéroCRE}`,
            ),
          },
          statut: statut ? { operator: 'equal', value: statut } : undefined,
          appelOffre: appelOffre ? { operator: 'equal', value: appelOffre } : undefined,
        },
      });
    }

    return {
      ...recours,
      items: recours.items.map((recours) => mapToReadModel(recours)),
    };
  };

  mediator.register('Eliminé.Recours.Query.ListerRecours', handler);
};

const mapToReadModel = (projection: RecoursEntity): RecoursListItemReadModel => {
  return {
    ...projection,
    statut: StatutRecours.convertirEnValueType(projection.statut),
    misÀJourLe: DateTime.convertirEnValueType(projection.misÀJourLe),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(projection.identifiantProjet),
  };
};
