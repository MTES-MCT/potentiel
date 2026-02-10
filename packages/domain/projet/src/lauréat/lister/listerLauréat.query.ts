import { Message, MessageHandler, mediator } from 'mediateur';

import { Email } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';

import { LauréatEntity } from '../lauréat.entity.js';
import { Candidature, GetProjetUtilisateurScope, IdentifiantProjet } from '../../index.js';
import { CandidatureEntity, Localité } from '../../candidature/index.js';
import { PuissanceEntity } from '../puissance/index.js';
import { ProducteurEntity } from '../producteur/index.js';
import { ReprésentantLégalEntity } from '../représentantLégal/index.js';
import { Producteur, Puissance, ReprésentantLégal, StatutLauréat } from '../index.js';

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
      [PuissanceEntity, ProducteurEntity, ReprésentantLégalEntity, CandidatureEntity]
    >('lauréat', {
      range,
      orderBy: {
        nomProjet: 'ascending',
      },
      where: {
        identifiantProjet:
          scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
        nomProjet: Where.like(nomProjet),
        appelOffre: appelOffre?.length ? Where.matchAny(appelOffre) : undefined,
        période: Where.equal(periode),
        famille: Where.equal(famille),
        localité: { région: scope.type === 'région' ? Where.matchAny(scope.régions) : undefined },
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
            actionnariat:
              typeActionnariat && typeActionnariat.length > 0
                ? Where.matchAny(typeActionnariat)
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
  args: LauréatEntity &
    Joined<[PuissanceEntity, ProducteurEntity, ReprésentantLégalEntity, CandidatureEntity]>,
) => LauréatListItemReadModel;

const mapToReadModel: MapToReadModelProps = ({
  nomProjet,
  identifiantProjet,
  localité,
  statut,
  'représentant-légal': représentantLégal,
  producteur,
  puissance,
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
  };
};
