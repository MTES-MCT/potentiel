import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet, CommonPort } from '@potentiel-domain/common';
import { List, RangeOptions, Where } from '@potentiel-domain/entity';
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
  items: Array<RecoursListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerRecoursQuery = Message<
  'Éliminé.Recours.Query.ListerRecours',
  {
    utilisateur: {
      rôle: string;
      région?: string;
      email: string;
    };
    statut?: StatutRecours.RawType;
    appelOffre?: string;
    nomProjet?: string;
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
    nomProjet,
    utilisateur: { région, rôle, email },
    range,
  }) => {
    const régionProjet = Role.convertirEnValueType(rôle).estÉgaleÀ(Role.dreal)
      ? (région ?? 'non-trouvée')
      : undefined;

    const canSeeAllProjects = ['admin', 'dgec-validateur', 'dreal'].includes(rôle);
    const identifiantProjet = canSeeAllProjects
      ? undefined
      : await getIdentifiantProjetWhereCondition(listerProjetsAccessibles, email);

    const recours = await list<RecoursEntity>('recours', {
      orderBy: { misÀJourLe: 'descending' },
      range,
      where: {
        statut: Where.equal(statut),
        projet: {
          appelOffre: Where.equal(appelOffre),
          nom: Where.contains(nomProjet),
          région: Where.equal(régionProjet),
        },
        identifiantProjet,
      },
    });

    return {
      ...recours,
      items: recours.items.map((recours) => mapToReadModel(recours)),
    };
  };

  mediator.register('Éliminé.Recours.Query.ListerRecours', handler);
};

const mapToReadModel = (entity: RecoursEntity): RecoursListItemReadModel => {
  return {
    appelOffre: entity.projet?.appelOffre ?? 'N/A',
    nomProjet: entity.projet?.nom ?? 'N/A',
    période: entity.projet?.période ?? 'N/A',
    famille: entity.projet?.famille,
    statut: StatutRecours.convertirEnValueType(entity.statut),
    misÀJourLe: DateTime.convertirEnValueType(entity.misÀJourLe),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
  };
};

const getIdentifiantProjetWhereCondition = async (
  listerIdentifiantsProjetsAccessiblesPort: CommonPort.ListerIdentifiantsProjetsAccessiblesPort,
  email: string,
) => {
  const projets = await listerIdentifiantsProjetsAccessiblesPort(email);

  return Where.include(
    projets.map(
      ({ appelOffre, période, famille, numéroCRE }) =>
        `${appelOffre}#${période}#${famille}#${numéroCRE}`,
    ),
  );
};
