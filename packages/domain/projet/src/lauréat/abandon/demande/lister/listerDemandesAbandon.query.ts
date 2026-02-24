import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Joined, List, ListOptions, RangeOptions, Where } from '@potentiel-domain/entity';

import { getIdentifiantProjetWhereCondition } from '#helpers';

import { LauréatEntity } from '../../../lauréat.entity.js';
import { GetScopeProjetUtilisateur, IdentifiantProjet } from '../../../../index.js';
import {
  AutoritéCompétente,
  DemandeAbandonEntity,
  StatutAbandon,
  StatutPreuveRecandidature,
} from '../../index.js';

type DemandeAbandonListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  statut: StatutAbandon.ValueType;
  recandidature: boolean;
  preuveRecandidatureStatut: StatutPreuveRecandidature.ValueType;
  dateDemande: DateTime.ValueType;
  miseÀJourLe: DateTime.ValueType;
};

export type ListerDemandesAbandonReadModel = {
  items: ReadonlyArray<DemandeAbandonListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerDemandesAbandonQuery = Message<
  'Lauréat.Abandon.Query.ListerDemandesAbandon',
  {
    utilisateur: Email.RawType;
    recandidature?: boolean;
    statut?: Array<StatutAbandon.RawType>;
    appelOffre?: Array<string>;
    preuveRecandidatureStatut?: StatutPreuveRecandidature.RawType;
    nomProjet?: string;
    autoritéCompétente?: AutoritéCompétente.RawType;
    range: RangeOptions;
  },
  ListerDemandesAbandonReadModel
>;

export type ListerDemandesAbandonDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
};

export const registerListerDemandesAbandonQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerDemandesAbandonDependencies) => {
  const handler: MessageHandler<ListerDemandesAbandonQuery> = async ({
    recandidature,
    statut,
    appelOffre,
    preuveRecandidatureStatut,
    nomProjet,
    autoritéCompétente,
    utilisateur,
    range,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const options: ListOptions<DemandeAbandonEntity, LauréatEntity> = {
      range,
      orderBy: {
        miseÀJourLe: 'descending',
      },
      where: {
        identifiantProjet: getIdentifiantProjetWhereCondition(scope),
        statut: statut?.length ? Where.matchAny(statut) : undefined,
        demande: {
          estUneRecandidature: Where.equal(recandidature),
          recandidature: {
            statut: Where.equal(preuveRecandidatureStatut),
          },
          autoritéCompétente: Where.equal(autoritéCompétente),
        },
      },
      join: {
        entity: 'lauréat',
        on: 'identifiantProjet',
        where: {
          appelOffre: appelOffre?.length ? Where.matchAny(appelOffre) : undefined,
          nomProjet: Where.like(nomProjet),
          localité: { région: scope.type === 'région' ? Where.matchAny(scope.régions) : undefined },
        },
      },
    };

    const demandesAbandons = await list<DemandeAbandonEntity, LauréatEntity>(
      'demande-abandon',
      options,
    );
    return {
      ...demandesAbandons,
      items: demandesAbandons.items.map((abandon) => mapToReadModel(abandon)),
    };
  };

  mediator.register('Lauréat.Abandon.Query.ListerDemandesAbandon', handler);
};

const mapToReadModel = (
  entity: DemandeAbandonEntity & Joined<LauréatEntity>,
): DemandeAbandonListItemReadModel => {
  return {
    nomProjet: entity.lauréat.nomProjet,
    statut: StatutAbandon.convertirEnValueType(entity.statut),
    recandidature: !!entity.demande.recandidature,
    miseÀJourLe: DateTime.convertirEnValueType(entity.miseÀJourLe),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
    preuveRecandidatureStatut: entity.demande.recandidature
      ? StatutPreuveRecandidature.convertirEnValueType(entity.demande.recandidature.statut)
      : StatutPreuveRecandidature.nonApplicable,
    dateDemande: DateTime.convertirEnValueType(entity.demande.demandéLe),
  };
};
