import { type Message, type MessageHandler, mediator } from 'mediateur';

import { Email } from '@potentiel-domain/common';
import {
  type Joined,
  type LeftJoin,
  type List,
  type RangeOptions,
  Where,
} from '@potentiel-domain/entity';

import { type CandidatureEntity, Localité } from '../../candidature/index.js';
import { Candidature, type GetScopeProjetUtilisateur, IdentifiantProjet } from '../../index.js';
import {
  type Producteur,
  type Puissance,
  type ReprésentantLégal,
  StatutLauréat,
} from '../index.js';
import type { LauréatEntity } from '../lauréat.entity.js';
import type { PowerPurchaseAgreementEntity } from '../power-purchase-agreement/powerPurchaseAgreement.entity.js';
import type { ProducteurEntity } from '../producteur/index.js';
import type { PuissanceEntity } from '../puissance/index.js';
import type { ReprésentantLégalEntity } from '../représentantLégal/index.js';

type LauréatListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  localité: Localité.ValueType;
  producteur: Producteur.ConsulterProducteurReadModel['producteur'];
  email: Email.ValueType;
  nomReprésentantLégal: ReprésentantLégal.ConsulterReprésentantLégalReadModel['nomReprésentantLégal'];
  puissance: {
    unité: Candidature.UnitéPuissance.ValueType;
    valeur: Puissance.ConsulterPuissanceReadModel['puissance'];
  };
  prixReference: Candidature.ConsulterCandidatureReadModel['dépôt']['prixReference'];
  evaluationCarboneSimplifiée: Candidature.ConsulterCandidatureReadModel['dépôt']['evaluationCarboneSimplifiée'];
  statut: StatutLauréat.ValueType;
  typeActionnariat?: Candidature.TypeActionnariat.ValueType;
  estPartiEnPPA?: true;
};

export type ListerLauréatReadModel = {
  items: ReadonlyArray<LauréatListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerLauréatQuery = Message<
  'Lauréat.Query.ListerLauréat',
  {
    utilisateur: Email.RawType;
    range: RangeOptions;
    statut?: Array<StatutLauréat.RawType>;
    appelOffre?: Array<string>;
    periode?: string;
    famille?: string;
    typeActionnariat?: Array<Candidature.TypeActionnariat.RawType>;
    nomProjet?: string;
    estPartiEnPPA?: boolean;
  },
  ListerLauréatReadModel
>;

export type ListerLauréatDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
};

type JoinedEntities = [
  PuissanceEntity,
  ProducteurEntity,
  ReprésentantLégalEntity,
  CandidatureEntity,
  LeftJoin<PowerPurchaseAgreementEntity>,
];

export const registerListerLauréatQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerLauréatDependencies) => {
  const handler: MessageHandler<ListerLauréatQuery> = async ({
    utilisateur,
    nomProjet,
    appelOffre,
    periode,
    famille,
    range,
    statut,
    typeActionnariat,
    estPartiEnPPA,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const lauréats = await list<LauréatEntity, JoinedEntities>('lauréat', {
      range,
      orderBy: {
        nomProjet: 'ascending',
      },
      where: {
        identifiantProjet: Where.matchAny(scope.identifiantProjets),
        nomProjet: Where.like(nomProjet),
        appelOffre: appelOffre?.length ? Where.matchAny(appelOffre) : undefined,
        période: Where.equal(periode),
        famille: Where.equal(famille),
        localité: { région: Where.matchAny(scope.régions) },
        statut: statut?.length ? Where.matchAny(statut) : undefined,
      },
      join: [
        {
          entity: 'puissance',
          on: 'identifiantProjet',
        },
        {
          entity: 'producteur',
          on: 'identifiantProjet',
        },
        {
          entity: 'représentant-légal',
          on: 'identifiantProjet',
        },
        {
          entity: 'candidature',
          on: 'identifiantProjet',
          where: {
            actionnariat: Where.matchAny(
              Candidature.TypeActionnariat.getTypeActionnariaWhereConditionsForQuery(
                typeActionnariat,
              ),
            ),
          },
        },
        {
          entity: 'power-purchase-agreement',
          on: 'identifiantProjet',
          type: 'left',
          where: {
            signaléLe:
              estPartiEnPPA === true
                ? Where.notEqualNull()
                : estPartiEnPPA === false
                  ? Where.equalNull()
                  : undefined,
          },
        },
      ],
    });

    return {
      ...lauréats,
      items: lauréats.items.map((lauréat) => mapToReadModel(lauréat)),
    };
  };

  mediator.register('Lauréat.Query.ListerLauréat', handler);
};

type MapToReadModelProps = (
  args: LauréatEntity & Joined<JoinedEntities>,
) => LauréatListItemReadModel;

const mapToReadModel: MapToReadModelProps = ({
  nomProjet,
  identifiantProjet,
  localité,
  statut,
  'représentant-légal': représentantLégal,
  producteur,
  puissance,
  'power-purchase-agreement': powerPurchaseAgreement,
  candidature: {
    emailContact,
    evaluationCarboneSimplifiée,
    prixReference,
    actionnariat,
    unitéPuissance,
  },
}) => {
  const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

  return {
    identifiantProjet: identifiantProjetValueType,
    nomProjet,
    localité: Localité.bind(localité),
    producteur: producteur.nom,
    email: Email.convertirEnValueType(emailContact),
    nomReprésentantLégal: représentantLégal.nomReprésentantLégal,
    puissance: {
      unité: Candidature.UnitéPuissance.convertirEnValueType(unitéPuissance),
      valeur: puissance.puissance,
    },
    prixReference,
    evaluationCarboneSimplifiée,
    typeActionnariat: actionnariat
      ? Candidature.TypeActionnariat.convertirEnValueType(actionnariat)
      : undefined,
    statut: StatutLauréat.convertirEnValueType(statut),
    estPartiEnPPA: powerPurchaseAgreement ? true : undefined,
  };
};
