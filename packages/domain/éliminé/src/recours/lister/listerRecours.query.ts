import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet, CommonPort } from '@potentiel-domain/common';
import { IncludeWhereCondition, List, RangeOptions } from '@potentiel-domain/entity';
import { Role } from '@potentiel-domain/utilisateur';

import { StatutRecours } from '..';
import { RecoursEntity } from '../recours.entity';

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
      régionDreal: string;
      email: string;
    };
    statut?: StatutRecours.RawType;
    appelOffre?: string;
    range?: RangeOptions;
  },
  ListerRecoursReadModel
>;

export type ListerRecoursDependencies = {
  list: List;
  listerProjetsAccessibles: CommonPort.ListerIdentifiantsProjetsAccessiblesPort;
};

export const registerListerRecoursQuery = ({
  list,
  listerProjetsAccessibles,
}: ListerRecoursDependencies) => {
  const handler: MessageHandler<ListerRecoursQuery> = async ({
    statut,
    appelOffre,
    utilisateur: { régionDreal, rôle, email },
    range,
  }) => {
    const régionProjet = Role.convertirEnValueType(rôle).estÉgaleÀ(Role.dreal)
      ? régionDreal ?? 'non-trouvée'
      : undefined;

    const canSeeAllProjects = ['admin', 'dgec-validateur', 'dreal'].includes(rôle);
    const identifiantProjet = canSeeAllProjects
      ? undefined
      : await getIdentifiantProjetWhereCondition(listerProjetsAccessibles, email);

    const recours = await list<RecoursEntity>('recours', {
      orderBy: { misÀJourLe: 'descending' },
      range,
      where: {
        statut: mapToWhereEqual(statut),
        appelOffre: mapToWhereEqual(appelOffre),
        régionProjet: mapToWhereEqual(régionProjet),
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

const mapToWhereEqual = <T>(value: T | undefined) =>
  value !== undefined ? { operator: 'equal' as const, value } : undefined;

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
