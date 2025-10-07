import { Message, MessageHandler, mediator } from 'mediateur';

import { Email } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Candidature, GetProjetUtilisateurScope, IdentifiantProjet } from '../..';
import { CandidatureEntity, Localité } from '../../candidature';
import { ÉliminéEntity } from '../éliminé.entity';

type ÉliminéListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  localité: Localité.ValueType;
  producteur: Candidature.ConsulterCandidatureReadModel['dépôt']['nomCandidat'];
  email: Email.ValueType;
  nomReprésentantLégal: Candidature.ConsulterCandidatureReadModel['dépôt']['nomReprésentantLégal'];
  puissance: {
    unité: Candidature.UnitéPuissance.ValueType;
    valeur: Candidature.ConsulterCandidatureReadModel['dépôt']['puissanceProductionAnnuelle'];
  };
  prixReference: Candidature.ConsulterCandidatureReadModel['dépôt']['prixReference'];
  evaluationCarboneSimplifiée: Candidature.ConsulterCandidatureReadModel['dépôt']['evaluationCarboneSimplifiée'];
  typeActionnariat?: Candidature.TypeActionnariat.ValueType;
};

export type ListerÉliminéReadModel = {
  items: ReadonlyArray<ÉliminéListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerÉliminéQuery = Message<
  'Éliminé.Query.ListerÉliminé',
  {
    utilisateur: Email.RawType;
    range: RangeOptions;
    appelOffre?: string;
    periode?: string;
    famille?: string;
    nomProjet?: string;
    typeActionnariat?: Array<Candidature.TypeActionnariat.RawType>;
  },
  ListerÉliminéReadModel
>;

export type ListerÉliminéDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

export const registerListerÉliminéQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerÉliminéDependencies) => {
  const handler: MessageHandler<ListerÉliminéQuery> = async ({
    utilisateur,
    appelOffre,
    periode,
    famille,
    nomProjet,
    range,
    typeActionnariat,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const éliminés = await list<CandidatureEntity, [ÉliminéEntity, AppelOffre.AppelOffreEntity]>(
      'candidature',
      {
        range,
        orderBy: {
          nomProjet: 'ascending',
        },
        where: {
          identifiantProjet:
            scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
          appelOffre: Where.equal(appelOffre),
          période: Where.equal(periode),
          famille: Where.equal(famille),
          nomProjet: Where.contain(nomProjet),
          localité: scope.type === 'region' ? { région: Where.equal(scope.region) } : undefined,
          actionnariat:
            typeActionnariat && typeActionnariat.length > 0
              ? Where.matchAny(typeActionnariat)
              : undefined,
        },
        join: [
          {
            entity: 'éliminé',
            on: 'identifiantProjet',
          },
          {
            entity: 'appel-offre',
            on: 'appelOffre',
          },
        ],
      },
    );

    return {
      ...éliminés,
      items: éliminés.items.map((éliminé) => mapToReadModel(éliminé)),
    };
  };

  mediator.register('Éliminé.Query.ListerÉliminé', handler);
};

type MapToReadModelProps = (
  args: CandidatureEntity & Joined<ÉliminéEntity>,
) => ÉliminéListItemReadModel;

const mapToReadModel: MapToReadModelProps = ({
  identifiantProjet,
  nomProjet,
  localité,
  nomReprésentantLégal,
  nomCandidat: producteur,
  puissanceProductionAnnuelle: puissance,
  unitéPuissance,
  emailContact,
  prixReference,
  evaluationCarboneSimplifiée,
  actionnariat,
}) => {
  const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

  return {
    identifiantProjet: identifiantProjetValueType,
    nomProjet,
    localité: Localité.bind(localité),
    producteur,
    email: Email.convertirEnValueType(emailContact),
    nomReprésentantLégal,
    puissance: {
      unité: Candidature.UnitéPuissance.convertirEnValueType(unitéPuissance),
      valeur: puissance,
    },
    prixReference,
    evaluationCarboneSimplifiée,
    typeActionnariat: actionnariat
      ? Candidature.TypeActionnariat.convertirEnValueType(actionnariat)
      : undefined,
  };
};
