import { Message, MessageHandler, mediator } from 'mediateur';

import { Joined, LeftJoin, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { DateTime, Email } from '@potentiel-domain/common';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { DossierRaccordementEntity, RaccordementEntity } from '../raccordement.entity';
import { LauréatEntity, Puissance, StatutLauréat } from '../..';
import { Candidature, GetProjetUtilisateurScope, IdentifiantProjet } from '../../..';
import { Localité, UnitéPuissance } from '../../../candidature';

type DossierRaccordementManquant = {
  nomProjet: string;
  identifiantProjet: IdentifiantProjet.ValueType;
  localité: Localité.ValueType;

  statut: StatutLauréat.ValueType<'actif' | 'achevé'>;
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  raisonSocialeGestionnaireRéseau: string;
  puissance: number;
  unitéPuissance: UnitéPuissance.ValueType;

  nomCandidat: string;
  sociétéMère: string;
  emailContact: string;
  dateNotification: DateTime.ValueType;
};

export type ListerDossierRaccordementManquantsReadModel = {
  items: Array<DossierRaccordementManquant>;
  range: RangeOptions;
  total: number;
};

export type ListerDossierRaccordementManquantsQuery = Message<
  'Lauréat.Raccordement.Query.ListerDossierRaccordementManquantsQuery',
  {
    identifiantUtilisateur: Email.RawType;
    identifiantGestionnaireRéseau?: string;
    range?: RangeOptions;
  },
  ListerDossierRaccordementManquantsReadModel
>;

export type ConsulterDossierRaccordementDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

type ListerDossierRaccordementManquantJoins = [
  LauréatEntity,
  Candidature.CandidatureEntity,
  Puissance.PuissanceEntity,
  GestionnaireRéseau.GestionnaireRéseauEntity,
  LeftJoin<DossierRaccordementEntity>,
];
export const registerListerDossierRaccordementManquantsQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ConsulterDossierRaccordementDependencies) => {
  const handler: MessageHandler<ListerDossierRaccordementManquantsQuery> = async ({
    identifiantUtilisateur,
    identifiantGestionnaireRéseau,
    range,
  }) => {
    const scope = await getScopeProjetUtilisateur(
      Email.convertirEnValueType(identifiantUtilisateur),
    );
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<RaccordementEntity, ListerDossierRaccordementManquantJoins>('raccordement', {
      where: {
        identifiantProjet:
          scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
        identifiantGestionnaireRéseau: Where.equal(
          scope.type === 'gestionnaire-réseau'
            ? scope.identifiantGestionnaireRéseau
            : identifiantGestionnaireRéseau,
        ),
      },
      range,
      orderBy: {
        identifiantProjet: 'ascending',
      },
      join: [
        {
          entity: 'lauréat',
          on: 'identifiantProjet',
          where: {
            localité: {
              région: scope.type === 'région' ? Where.matchAny(scope.régions) : undefined,
            },
          },
        },
        {
          entity: 'candidature',
          on: 'identifiantProjet',
        },
        {
          entity: 'puissance',
          on: 'identifiantProjet',
        },
        {
          entity: 'gestionnaire-réseau',
          on: 'identifiantGestionnaireRéseau',
        },
        {
          entity: 'dossier-raccordement',
          on: 'identifiantProjet',
          type: 'left',
          where: {
            identifiantProjet: Where.equalNull(),
          },
        },
      ],
    });

    return {
      items: items.map(mapToReadModel),
      range: {
        endPosition,
        startPosition,
      },
      total,
    };
  };

  mediator.register('Lauréat.Raccordement.Query.ListerDossierRaccordementManquantsQuery', handler);
};

type MapToReadModelProps = (
  raccordement: RaccordementEntity & Joined<ListerDossierRaccordementManquantJoins>,
) => DossierRaccordementManquant;

export const mapToReadModel: MapToReadModelProps = ({
  identifiantProjet,
  candidature: { unitéPuissance, nomCandidat, sociétéMère, emailContact },
  identifiantGestionnaireRéseau,
  puissance: { puissance },
  lauréat: { notifiéLe, nomProjet, localité, statut },
  'gestionnaire-réseau': gestionnaireRéseau,
}) => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    statut: StatutLauréat.convertirEnValueType(statut),
    puissance,
    unitéPuissance: UnitéPuissance.convertirEnValueType(unitéPuissance),
    nomProjet,
    nomCandidat,
    sociétéMère,
    emailContact,
    dateNotification: DateTime.convertirEnValueType(notifiéLe),
    identifiantGestionnaireRéseau:
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseau,
      ),
    raisonSocialeGestionnaireRéseau: gestionnaireRéseau.raisonSociale,
    localité: Localité.bind(localité),
  };
};
