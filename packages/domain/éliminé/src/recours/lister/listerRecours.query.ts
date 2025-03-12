import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { RécupérerIdentifiantsProjetParEmailPorteurPort } from '@potentiel-domain/utilisateur';
import { Candidature } from '@potentiel-domain/candidature';

import { StatutRecours } from '..';
import { RecoursEntity } from '../recours.entity';
import { getRoleBasedWhereCondition, Utilisateur } from '../../_utils/getRoleBasedWhereCondition';

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
    utilisateur: Utilisateur;
    statut?: StatutRecours.RawType;
    appelOffre?: string;
    nomProjet?: string;
    range?: RangeOptions;
  },
  ListerRecoursReadModel
>;

export type ListerRecoursDependencies = {
  list: List;
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteurPort;
};

export const registerListerRecoursQuery = ({
  list,
  récupérerIdentifiantsProjetParEmailPorteur,
}: ListerRecoursDependencies) => {
  const handler: MessageHandler<ListerRecoursQuery> = async ({
    statut,
    appelOffre,
    nomProjet,
    utilisateur,
    range,
  }) => {
    const { identifiantProjet, régionProjet } = await getRoleBasedWhereCondition(
      utilisateur,
      récupérerIdentifiantsProjetParEmailPorteur,
    );

    const recours = await list<RecoursEntity, Candidature.CandidatureEntity>('recours', {
      orderBy: { misÀJourLe: 'descending' },
      range,
      where: {
        identifiantProjet,
        statut: Where.equal(statut),
      },
      join: {
        entity: 'candidature',
        on: 'identifiantProjet',
        where: {
          appelOffre: Where.equal(appelOffre),
          nomProjet: Where.contain(nomProjet),
          localité: {
            région: régionProjet,
          },
        },
      },
    });

    return {
      ...recours,
      items: recours.items.map((recours) => mapToReadModel(recours)),
    };
  };

  mediator.register('Éliminé.Recours.Query.ListerRecours', handler);
};

const mapToReadModel = (
  entity: RecoursEntity & Joined<Candidature.CandidatureEntity>,
): RecoursListItemReadModel => {
  const { appelOffre, période, famille } = IdentifiantProjet.convertirEnValueType(
    entity.identifiantProjet,
  );

  return {
    appelOffre,
    période,
    famille,
    nomProjet: entity.candidature?.nomProjet ?? 'N/A',
    statut: StatutRecours.convertirEnValueType(entity.statut),
    misÀJourLe: DateTime.convertirEnValueType(entity.misÀJourLe),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
  };
};
