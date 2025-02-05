import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { List, ListOptions, RangeOptions, Where } from '@potentiel-domain/entity';
import { RécupérerIdentifiantsProjetParEmailPorteurPort } from '@potentiel-domain/utilisateur';

import { StatutAbandon, StatutPreuveRecandidature } from '..';
import { AbandonEntity } from '../abandon.entity';
import { getRoleBasedWhereCondition, Utilisateur } from '../../utils/getRoleBasedWhereCondition';

type AbandonListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
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
    utilisateur: Utilisateur;
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
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteurPort;
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
    utilisateur,
    range,
  }) => {
    const { identifiantProjet, régionProjet } = await getRoleBasedWhereCondition(
      utilisateur,
      récupérerIdentifiantsProjetParEmailPorteur,
    );

    const options: ListOptions<AbandonEntity> = {
      range,
      orderBy: {
        misÀJourLe: 'descending',
      },
      where: {
        identifiantProjet,
        statut: Where.equal(statut),
        projet: {
          appelOffre: Where.equal(appelOffre),
          nom: Where.contains(nomProjet),
          région: régionProjet,
        },
        demande: {
          estUneRecandidature: Where.equal(recandidature),
          recandidature: {
            statut: Where.equal(preuveRecandidatureStatut),
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
    nomProjet: entity.projet?.nom || 'Projet inconnu',
    statut: StatutAbandon.convertirEnValueType(entity.statut),
    recandidature: !!entity.demande.recandidature,
    misÀJourLe: DateTime.convertirEnValueType(entity.misÀJourLe),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
    preuveRecandidatureStatut: entity.demande.recandidature
      ? StatutPreuveRecandidature.convertirEnValueType(entity.demande.recandidature.statut)
      : StatutPreuveRecandidature.nonApplicable,
  };
};
