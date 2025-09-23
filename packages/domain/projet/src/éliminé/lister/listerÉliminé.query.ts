import { Message, MessageHandler, mediator } from 'mediateur';

import { Email } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Candidature, GetProjetUtilisateurScope, IdentifiantProjet, StatutProjet } from '../..';
import { CandidatureEntity, Localité, UnitéPuissance } from '../../candidature';
import { ÉliminéEntity } from '../éliminé.entity';

type ÉliminéListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  localité: Localité.ValueType;
  producteur: Candidature.ConsulterCandidatureReadModel['dépôt']['nomCandidat'];
  email: Email.ValueType;
  nomReprésentantLégal: Candidature.ConsulterCandidatureReadModel['dépôt']['nomReprésentantLégal'];
  puissance: {
    unité: AppelOffre.ConsulterAppelOffreReadModel['unitePuissance'];
    valeur: Candidature.ConsulterCandidatureReadModel['dépôt']['puissanceProductionAnnuelle'];
  };
  prixReference: Candidature.ConsulterCandidatureReadModel['dépôt']['prixReference'];
  evaluationCarboneSimplifiée: Candidature.ConsulterCandidatureReadModel['dépôt']['evaluationCarboneSimplifiée'];
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
    nomProjet?: string;
    statut?: StatutProjet.RawType;
    appelOffre?: string;
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
    nomProjet,
    appelOffre,
    range,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const éliminés = await list<CandidatureEntity, [ÉliminéEntity, AppelOffre.AppelOffreEntity]>(
      'candidature',
      {
        range,
        // todo : order by candidature.nomProjet ????
        // orderBy: {
        //   candidature: {
        //     nomProjet: 'ascending',
        //   },
        // },
        where: {
          identifiantProjet:
            scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
          appelOffre: Where.equal(appelOffre),
          nomProjet: Where.contain(nomProjet),
          localité: scope.type === 'region' ? { région: Where.equal(scope.region) } : undefined,
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
  args: CandidatureEntity & Joined<[ÉliminéEntity, AppelOffre.AppelOffreEntity]>,
) => ÉliminéListItemReadModel;

const mapToReadModel: MapToReadModelProps = ({
  identifiantProjet,
  'appel-offre': appelOffres,
  nomProjet,
  localité,
  nomReprésentantLégal,
  nomCandidat: producteur,
  puissanceProductionAnnuelle: puissance,
  emailContact,
  technologie,
  prixReference,
  evaluationCarboneSimplifiée,
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
      unité: UnitéPuissance.déterminer({
        appelOffres,
        période: identifiantProjetValueType.période,
        technologie,
      }).formatter(),
      valeur: puissance,
    },
    prixReference,
    evaluationCarboneSimplifiée,
  };
};
