import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';

import { StatutRecours } from '../index.js';
import { DemandeRecoursEntity } from '../demandeRecours.entity.js';
import { Candidature, IdentifiantProjet } from '../../../index.js';
import { GetScopeProjetUtilisateur } from '../../../getScopeProjetUtilisateur.port.js';

type DemandeRecoursListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: string;
  période: string;
  famille?: string;
  nomProjet: string;
  statut: StatutRecours.ValueType;
  dateDemande: DateTime.ValueType;
  miseÀJourLe: DateTime.ValueType;
};

export type ListerDemandeRecoursReadModel = {
  items: Array<DemandeRecoursListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerDemandeRecoursQuery = Message<
  'Éliminé.Recours.Query.ListerDemandeRecours',
  {
    utilisateur: Email.RawType;
    statut?: Array<StatutRecours.RawType>;
    appelOffre?: Array<string>;
    nomProjet?: string;
    range?: RangeOptions;
  },
  ListerDemandeRecoursReadModel
>;

export type ListerDemandeRecoursDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
};

export const registerListerDemandeRecoursQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerDemandeRecoursDependencies) => {
  const handler: MessageHandler<ListerDemandeRecoursQuery> = async ({
    statut,
    appelOffre,
    nomProjet,
    utilisateur,
    range,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const recours = await list<DemandeRecoursEntity, Candidature.CandidatureEntity>(
      'demande-recours',
      {
        orderBy: { miseÀJourLe: 'descending' },
        range,
        where: {
          identifiantProjet: Where.matchAny(scope.identifiantProjets),
          statut: Where.matchAny(statut),
        },
        join: {
          entity: 'candidature',
          on: 'identifiantProjet',
          where: {
            appelOffre: appelOffre?.length ? Where.matchAny(appelOffre) : undefined,
            nomProjet: Where.like(nomProjet),
            localité: {
              région: Where.matchAny(scope.régions),
            },
          },
        },
      },
    );

    return {
      ...recours,
      items: recours.items.map((recours) => mapToReadModel(recours)),
    };
  };

  mediator.register('Éliminé.Recours.Query.ListerDemandeRecours', handler);
};

const mapToReadModel = (
  entity: DemandeRecoursEntity & Joined<Candidature.CandidatureEntity>,
): DemandeRecoursListItemReadModel => {
  const { appelOffre, période, famille } = IdentifiantProjet.convertirEnValueType(
    entity.identifiantProjet,
  );

  return {
    appelOffre,
    période,
    famille,
    nomProjet: entity.candidature?.nomProjet ?? 'N/A',
    statut: StatutRecours.convertirEnValueType(entity.statut),
    miseÀJourLe: DateTime.convertirEnValueType(entity.miseÀJourLe),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
    dateDemande: DateTime.convertirEnValueType(entity.demande.demandéLe),
  };
};
