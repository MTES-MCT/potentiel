import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { List, ListOptions, RangeOptions } from '@potentiel-domain/core';
import { Role, RécupérerIdentifiantsProjetParEmailPorteur } from '@potentiel-domain/utilisateur';

import { StatutAbandon, StatutPreuveRecandidature } from '..';
import { AbandonEntity } from '../abandon.entity';

/**
 * @todo A voir si on généralise cette pratique et si on déplace ça dans le package core ou un nouveau package entity
 */
const mapToWhereEqual = <T>(value: T | undefined) =>
  value !== undefined
    ? {
        operator: 'equal' as const,
        value,
      }
    : undefined;

const mapToWhereLike = (value: string | undefined) =>
  value !== undefined
    ? {
        operator: 'like' as const,
        value: `%${value}%` as `%${string}%`,
      }
    : undefined;

type AbandonListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: string;
  période: string;
  famille?: string;
  nomProjet: string;
  statut: StatutAbandon.ValueType;
  recandidature: boolean;
  preuveRecandidatureStatut: StatutPreuveRecandidature.ValueType;
  misÀJourLe: DateTime.ValueType;
};

export type ListerAbandonReadModel = {
  items: ReadonlyArray<AbandonListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerAbandonsQuery = Message<
  'Lauréat.Abandon.Query.ListerAbandons',
  {
    utilisateur: {
      rôle: string;
      email: string;
      régionDreal?: string;
    };
    recandidature?: boolean;
    statut?: StatutAbandon.RawType;
    appelOffre?: string;
    preuveRecandidatureStatut?: StatutPreuveRecandidature.RawType;
    nomProjet?: string;
    range: RangeOptions;
  },
  ListerAbandonReadModel
>;

export type ListerAbandonDependencies = {
  list: List;
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteur;
};

export const registerListerAbandonQuery = ({
  list,
  récupérerIdentifiantsProjetParEmailPorteur,
}: ListerAbandonDependencies) => {
  const handler: MessageHandler<ListerAbandonsQuery> = async ({
    recandidature,
    statut,
    appelOffre,
    preuveRecandidatureStatut,
    nomProjet,
    utilisateur: { email, régionDreal, rôle },
    range,
  }) => {
    const options: ListOptions<AbandonEntity> = {
      range,
      orderBy: {
        misÀJourLe: 'descending',
      },
      where: {
        identifiantProjet: await getIdentifiantProjetWhereCondition(
          rôle,
          email,
          récupérerIdentifiantsProjetParEmailPorteur,
        ),
        statut: mapToWhereEqual(statut),
        projet: {
          appelOffre: mapToWhereEqual(appelOffre),
          nom: mapToWhereLike(nomProjet),
          région: mapToWhereEqual(régionDreal),
        },
        demande: {
          estUneRecandidature: mapToWhereEqual(recandidature),
          recandidature: {
            statut: mapToWhereEqual(preuveRecandidatureStatut),
          },
        },
      },
    };

    const abandons = await list<AbandonEntity>('abandon', options);
    return {
      ...abandons,
      items: abandons.items.map((abandon) => mapToReadModel(abandon)),
    };
  };

  mediator.register('Lauréat.Abandon.Query.ListerAbandons', handler);
};

const mapToReadModel = (entity: AbandonEntity): AbandonListItemReadModel => {
  return {
    appelOffre: entity.projet?.appelOffre || 'N/A',
    nomProjet: entity.projet?.nom || 'Projet inconnu',
    période: entity.projet?.période || 'N/A',
    famille: entity.projet?.famille,
    statut: StatutAbandon.convertirEnValueType(entity.statut),
    recandidature: !!entity.demande.recandidature,
    misÀJourLe: DateTime.convertirEnValueType(entity.misÀJourLe),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
    preuveRecandidatureStatut: entity.demande.recandidature
      ? StatutPreuveRecandidature.convertirEnValueType(entity.demande.recandidature.statut)
      : StatutPreuveRecandidature.nonApplicable,
  };
};

const getIdentifiantProjetWhereCondition = async (
  rôle: string,
  email: string,
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteur,
) => {
  if (Role.convertirEnValueType(rôle).estÉgaleÀ(Role.porteur)) {
    const identifiantProjets = await récupérerIdentifiantsProjetParEmailPorteur(email);

    return {
      operator: 'include',
      value: identifiantProjets,
    } as const;
  }

  return undefined;
};
