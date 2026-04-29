import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Joined, LeftJoin, List, ListOptions, RangeOptions, Where } from '@potentiel-domain/entity';

import { LauréatEntity } from '../../../lauréat.entity.js';
import { GetScopeProjetUtilisateur, IdentifiantProjet } from '../../../../index.js';
import {
  AutoritéCompétente,
  DemandeAbandonEntity,
  StatutAbandon,
  StatutPreuveRecandidature,
} from '../../index.js';
import { PowerPurchaseAgreementEntity } from '../../../power-purchase-agreement/powerPurchaseAgreement.entity.js';

type DemandeAbandonListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  statut: StatutAbandon.ValueType;
  estPartiEnPPA?: true;
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
    estPartiEnPPA?: boolean;
    range: RangeOptions;
  },
  ListerDemandesAbandonReadModel
>;

export type ListerDemandesAbandonDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
};

type JoinedEntities = [LauréatEntity, LeftJoin<PowerPurchaseAgreementEntity>];

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
    estPartiEnPPA,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const options: ListOptions<DemandeAbandonEntity, JoinedEntities> = {
      range,
      orderBy: {
        miseÀJourLe: 'descending',
      },
      where: {
        identifiantProjet: Where.matchAny(scope.identifiantProjets),
        statut: statut?.length ? Where.matchAny(statut) : undefined,
        demande: {
          estUneRecandidature: Where.equal(recandidature),
          recandidature: {
            statut: Where.equal(preuveRecandidatureStatut),
          },
          autoritéCompétente: Where.equal(autoritéCompétente),
        },
      },
      join: [
        {
          entity: 'lauréat',
          on: 'identifiantProjet',
          where: {
            appelOffre: appelOffre?.length ? Where.matchAny(appelOffre) : undefined,
            nomProjet: Where.like(nomProjet),
            localité: { région: Where.matchAny(scope.régions) },
          },
        },
        {
          entity: 'power-purchase-agreement',
          on: 'identifiantProjet',
          type: 'left',
          where: {
            estPartiEnPPA: estPartiEnPPA !== undefined ? Where.equal(estPartiEnPPA) : undefined,
          },
        },
      ],
    };

    const demandesAbandons = await list<DemandeAbandonEntity, JoinedEntities>(
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

const mapToReadModel = ({
  lauréat,
  statut,
  demande,
  identifiantProjet,
  miseÀJourLe,
  'power-purchase-agreement': powerPurchaseAgreement,
}: DemandeAbandonEntity & Joined<JoinedEntities>): DemandeAbandonListItemReadModel => {
  return {
    nomProjet: lauréat.nomProjet,
    statut: StatutAbandon.convertirEnValueType(statut),
    recandidature: !!demande.recandidature,
    miseÀJourLe: DateTime.convertirEnValueType(miseÀJourLe),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    preuveRecandidatureStatut: demande.recandidature
      ? StatutPreuveRecandidature.convertirEnValueType(demande.recandidature.statut)
      : StatutPreuveRecandidature.nonApplicable,
    dateDemande: DateTime.convertirEnValueType(demande.demandéLe),
    estPartiEnPPA: powerPurchaseAgreement?.estPartiEnPPA ? true : undefined,
  };
};
