import { Message, MessageHandler, mediator } from 'mediateur';
import { RecoursEntity } from '../recours.entity';
import { DateTime, IdentifiantProjet, CommonPort } from '@potentiel-domain/common';
import { StatutRecours } from '..';
import { Option } from '@potentiel-libraries/monads';
import {
  EqualWhereCondition,
  IncludeWhereCondition,
  ListV2,
  RangeOptions,
} from '@potentiel-domain/core';

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
    const régionProjet =
      rôle === 'dreal'
        ? await getRegionProjetWhereCondition(récupérerRégionDreal, email)
        : undefined;

    const canSeeAllProjects = ['admin', 'dgec-validateur', 'dreal'].includes(rôle);
    const identifiantProjet = canSeeAllProjects
      ? undefined
      : await getIdentifiantProjetWhereCondition(listerProjetsAccessibles, email);

    const recours = await list<RecoursEntity>('recours', {
      orderBy: { misÀJourLe: 'descending' },
      range,
      where: {
        statut: statut ? { operator: 'equal', value: statut } : undefined,
        appelOffre: appelOffre ? { operator: 'equal', value: appelOffre } : undefined,
        régionProjet,
        identifiantProjet,
      },
    });

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

const getRegionProjetWhereCondition = async (
  récupérerRégionDreal: CommonPort.RécupérerRégionDrealPort,
  email: string,
): Promise<EqualWhereCondition<string> | undefined> => {
  const région = await récupérerRégionDreal(email);

  if (Option.isNone(région)) {
    return undefined;
  }

  return { operator: 'equal', value: région.région };
};

const getIdentifiantProjetWhereCondition = async (
  listerIdentifiantsProjetsAccessiblesPort: CommonPort.ListerIdentifiantsProjetsAccessiblesPort,
  email: string,
): Promise<IncludeWhereCondition<string> | undefined> => {
  const projets = await listerIdentifiantsProjetsAccessiblesPort(email);

  return {
    operator: 'include',
    value: projets.map(
      ({ appelOffre, période, famille, numéroCRE }) =>
        `${appelOffre}#${période}#${famille}#${numéroCRE}`,
    ),
  };
};
