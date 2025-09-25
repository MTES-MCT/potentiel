import { Message, MessageHandler, mediator } from 'mediateur';

import { Email } from '@potentiel-domain/common';
import { Joined, LeftJoin, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { LauréatEntity } from '../lauréat.entity';
import { Candidature, GetProjetUtilisateurScope, IdentifiantProjet, StatutProjet } from '../..';
import { CandidatureEntity, Localité, UnitéPuissance } from '../../candidature';
import { PuissanceEntity } from '../puissance';
import { ProducteurEntity } from '../producteur';
import { ReprésentantLégalEntity } from '../représentantLégal';
import { Producteur, Puissance, ReprésentantLégal } from '..';
import { AbandonEntity } from '../abandon';
import { AttestationConformitéEntity } from '../achèvement/attestationConformité';

type LauréatListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  localité: Localité.ValueType;
  producteur: Producteur.ConsulterProducteurReadModel['producteur'];
  email: Email.ValueType;
  nomReprésentantLégal: ReprésentantLégal.ConsulterReprésentantLégalReadModel['nomReprésentantLégal'];
  puissance: {
    unité: AppelOffre.ConsulterAppelOffreReadModel['unitePuissance'];
    valeur: Puissance.ConsulterPuissanceReadModel['puissance'];
  };
  prixReference: Candidature.ConsulterCandidatureReadModel['dépôt']['prixReference'];
  evaluationCarboneSimplifiée: Candidature.ConsulterCandidatureReadModel['dépôt']['evaluationCarboneSimplifiée'];
  statut?: Exclude<StatutProjet.ValueType, 'éliminé'>;
  typeActionnariat?: Candidature.TypeActionnariat.ValueType;
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
    nomProjet?: string;
    statut?: Exclude<StatutProjet.RawType, 'éliminé'>;
    appelOffre?: string;
    periode?: string;
    famille?: string;
    typeActionnariat?: Array<Candidature.TypeActionnariat.RawType>;
  },
  ListerLauréatReadModel
>;

export type ListerLauréatDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

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
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const lauréats = await list<
      LauréatEntity,
      [
        PuissanceEntity,
        ProducteurEntity,
        ReprésentantLégalEntity,
        CandidatureEntity,
        AppelOffre.AppelOffreEntity,
        LeftJoin<AbandonEntity>,
        LeftJoin<AttestationConformitéEntity>,
      ]
    >('lauréat', {
      range,
      orderBy: {
        nomProjet: 'ascending',
      },
      where: {
        identifiantProjet:
          scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
        nomProjet: Where.contain(nomProjet),
        appelOffre: Where.equal(appelOffre),
        période: Where.equal(periode),
        famille: Where.equal(famille),
        localité: { région: scope.type === 'region' ? Where.equal(scope.region) : undefined },
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
            actionnariat:
              typeActionnariat && typeActionnariat.length > 0
                ? Where.matchAny(typeActionnariat)
                : undefined,
          },
        },
        {
          entity: 'appel-offre',
          on: 'appelOffre',
        },
        {
          entity: 'abandon',
          on: 'identifiantProjet',
          type: 'left',
          where:
            statut === 'abandonné'
              ? { statut: Where.equal('accordé') }
              : statut === 'classé'
                ? { statut: Where.notEqual('accordé') }
                : undefined,
        },
        {
          entity: 'attestation-conformité',
          on: 'identifiantProjet',
          type: 'left',
          where:
            statut === 'achevé'
              ? { identifiantProjet: Where.notEqualNull() }
              : statut === 'classé'
                ? { identifiantProjet: Where.equalNull() }
                : undefined,
        },
      ],
    });

    console.log(lauréats.items);

    return {
      ...lauréats,
      items: lauréats.items.map((lauréat) => mapToReadModel(lauréat)),
    };
  };

  mediator.register('Lauréat.Query.ListerLauréat', handler);
};

type MapToReadModelProps = (
  args: LauréatEntity &
    Joined<
      [
        PuissanceEntity,
        ProducteurEntity,
        ReprésentantLégalEntity,
        CandidatureEntity,
        AppelOffre.AppelOffreEntity,
        LeftJoin<AbandonEntity>,
        LeftJoin<AttestationConformitéEntity>,
      ]
    >,
) => LauréatListItemReadModel;

const mapToReadModel: MapToReadModelProps = ({
  nomProjet,
  identifiantProjet,
  localité,
  'représentant-légal': représentantLégal,
  producteur,
  puissance,
  candidature: {
    emailContact,
    technologie,
    evaluationCarboneSimplifiée,
    prixReference,
    actionnariat,
  },
  'appel-offre': appelOffres,
  abandon,
  'attestation-conformité': attestationConformité,
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
      unité: UnitéPuissance.déterminer({
        appelOffres,
        période: identifiantProjetValueType.période,
        technologie,
      }).formatter(),
      valeur: puissance.puissance,
    },
    prixReference,
    evaluationCarboneSimplifiée,
    typeActionnariat: actionnariat
      ? Candidature.TypeActionnariat.convertirEnValueType(actionnariat)
      : undefined,
    statut: abandon
      ? StatutProjet.abandonné
      : attestationConformité
        ? StatutProjet.achevé
        : undefined,
  };
};
