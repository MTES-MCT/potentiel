import { Message, MessageHandler, mediator } from 'mediateur';

import { Email } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { LauréatEntity } from '../lauréat.entity';
import { Candidature, GetProjetUtilisateurScope, IdentifiantProjet } from '../..';
import { CandidatureEntity, Localité, UnitéPuissance } from '../../candidature';
import { PuissanceEntity } from '../puissance';
import { ProducteurEntity } from '../producteur';
import { ReprésentantLégalEntity } from '../représentantLégal';
import { Producteur, Puissance, ReprésentantLégal } from '..';

type LauréatListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  localité: Localité.ValueType;
  producteur: Producteur.ConsulterProducteurReadModel['producteur'];
  représentantLégal: {
    nom: ReprésentantLégal.ConsulterReprésentantLégalReadModel['nomReprésentantLégal'];
    email: string; // TODO ???? Ajouter email utilisateur dans la query
  };
  puissance: {
    unité: AppelOffre.ConsulterAppelOffreReadModel['unitePuissance'];
    valeur: Puissance.ConsulterPuissanceReadModel['puissance'];
  };
  prixReference: Candidature.ConsulterCandidatureReadModel['dépôt']['prixReference'];
  evaluationCarboneSimplifiée: Candidature.ConsulterCandidatureReadModel['dépôt']['evaluationCarboneSimplifiée'];
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
    appelOffre?: string;
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
    range,
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
        },
        {
          entity: 'appel-offre',
          on: 'appelOffre',
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

const mapToReadModel = ({
  nomProjet,
  identifiantProjet,
  localité,
  'représentant-légal': représentantLégal,
  producteur,
  puissance,
  candidature,
  'appel-offre': appelOffres,
}: LauréatEntity &
  Joined<
    [
      PuissanceEntity,
      ProducteurEntity,
      ReprésentantLégalEntity,
      CandidatureEntity,
      AppelOffre.AppelOffreEntity,
    ]
  >): LauréatListItemReadModel => {
  const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);
  return {
    identifiantProjet: identifiantProjetValueType,
    nomProjet,
    localité: Localité.bind(localité),
    producteur: producteur.nom,
    représentantLégal: {
      nom: représentantLégal.nomReprésentantLégal,
      email: candidature.emailContact,
    },
    puissance: {
      unité: UnitéPuissance.déterminer({
        appelOffres,
        période: identifiantProjetValueType.période,
        technologie: candidature.technologie,
      }).formatter(),
      valeur: puissance.puissance,
    },
    prixReference: candidature.prixReference,
    evaluationCarboneSimplifiée: candidature.evaluationCarboneSimplifiée,
  };
};
