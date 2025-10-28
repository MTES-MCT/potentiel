import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Joined, List, ListOptions, RangeOptions, Where } from '@potentiel-domain/entity';

import { AbandonEntity } from '../abandon.entity';
import { LauréatEntity } from '../../lauréat.entity';
import { GetProjetUtilisateurScope, IdentifiantProjet } from '../../..';
import { AutoritéCompétente, StatutAbandon, StatutPreuveRecandidature } from '..';

type AbandonListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  statut: StatutAbandon.ValueType;
  recandidature: boolean;
  preuveRecandidatureStatut: StatutPreuveRecandidature.ValueType;
  miseÀJourLe: DateTime.ValueType;
};

export type ListerAbandonReadModel = {
  items: ReadonlyArray<AbandonListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerAbandonsQuery = Message<
  'Lauréat.Abandon.Query.ListerAbandons',
  {
    utilisateur: Email.RawType;
    recandidature?: boolean;
    statut?: Array<StatutAbandon.RawType>;
    appelOffre?: string;
    preuveRecandidatureStatut?: StatutPreuveRecandidature.RawType;
    nomProjet?: string;
    autoritéCompétente?: AutoritéCompétente.RawType;
    range: RangeOptions;
  },
  ListerAbandonReadModel
>;

export type ListerAbandonDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

export const registerListerAbandonQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerAbandonDependencies) => {
  const handler: MessageHandler<ListerAbandonsQuery> = async ({
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

    const options: ListOptions<AbandonEntity, LauréatEntity> = {
      range,
      orderBy: {
        miseÀJourLe: 'descending',
      },
      where: {
        identifiantProjet:
          scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
        statut: Where.matchAny(statut),
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
          appelOffre: Where.equal(appelOffre),
          nomProjet: Where.like(nomProjet),
          localité: { région: scope.type === 'région' ? Where.matchAny(scope.régions) : undefined },
        },
      },
    };

    const abandons = await list<AbandonEntity, LauréatEntity>('abandon', options);
    return {
      ...abandons,
      items: abandons.items.map((abandon) => mapToReadModel(abandon)),
    };
  };

  mediator.register('Lauréat.Abandon.Query.ListerAbandons', handler);
};

const mapToReadModel = (
  entity: AbandonEntity & Joined<LauréatEntity>,
): AbandonListItemReadModel => {
  return {
    nomProjet: entity.lauréat.nomProjet,
    statut: StatutAbandon.convertirEnValueType(entity.statut),
    recandidature: !!entity.demande.recandidature,
    miseÀJourLe: DateTime.convertirEnValueType(entity.miseÀJourLe),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
    preuveRecandidatureStatut: entity.demande.recandidature
      ? StatutPreuveRecandidature.convertirEnValueType(entity.demande.recandidature.statut)
      : StatutPreuveRecandidature.nonApplicable,
  };
};
