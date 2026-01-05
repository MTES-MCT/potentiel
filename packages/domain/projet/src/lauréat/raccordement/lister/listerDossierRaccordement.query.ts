import { Message, MessageHandler, mediator } from 'mediateur';

import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { DateTime, Email } from '@potentiel-domain/common';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { DossierRaccordementEntity, RéférenceDossierRaccordement } from '..';
import { Candidature, GetProjetUtilisateurScope, IdentifiantProjet } from '../../..';
import { LauréatEntity, Puissance, Raccordement, StatutLauréat } from '../..';
import { AchèvementEntity } from '../../achèvement';
import { Localité, UnitéPuissance } from '../../../candidature';

type DossierRaccordement = {
  nomProjet: string;
  identifiantProjet: IdentifiantProjet.ValueType;
  statutProjet: StatutLauréat.ValueType<'actif' | 'achevé'>;
  localité: Localité.ValueType;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  dateMiseEnService?: DateTime.ValueType;
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  raisonSocialeGestionnaireRéseau: string;
  puissance: number;
  unitéPuissance: UnitéPuissance.ValueType;

  nomCandidat: string;
  sociétéMère: string;
  emailContact: string;
  dateNotification: DateTime.ValueType;
  dateAchèvement?: DateTime.ValueType;
};

export type ListerDossierRaccordementReadModel = {
  items: Array<DossierRaccordement>;
  range: RangeOptions;
  total: number;
};

export type ListerDossierRaccordementQuery = Message<
  'Lauréat.Raccordement.Query.ListerDossierRaccordementQuery',
  {
    utilisateur: Email.RawType;
    identifiantGestionnaireRéseau?: string;
    appelOffre?: string;
    avecDateMiseEnService?: boolean;
    range?: RangeOptions;
    référenceDossier?: string;
    région?: string;
    statutProjet?: StatutLauréat.RawType;
  },
  ListerDossierRaccordementReadModel
>;

export type ListerDossierRaccordementQueryDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

type DossierRaccordementJoins = [
  LauréatEntity,
  Candidature.CandidatureEntity,
  Puissance.PuissanceEntity,
  GestionnaireRéseau.GestionnaireRéseauEntity,
  AchèvementEntity,
];

export const registerListerDossierRaccordementQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerDossierRaccordementQueryDependencies) => {
  const handler: MessageHandler<ListerDossierRaccordementQuery> = async ({
    identifiantGestionnaireRéseau,
    appelOffre,
    avecDateMiseEnService,
    référenceDossier,
    range,
    utilisateur,
    statutProjet,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<DossierRaccordementEntity, DossierRaccordementJoins>('dossier-raccordement', {
      where: {
        identifiantProjet:
          scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
        référence: Where.like(référenceDossier),
        identifiantGestionnaireRéseau: Where.equal(
          scope.type === 'gestionnaire-réseau'
            ? scope.identifiantGestionnaireRéseau
            : identifiantGestionnaireRéseau,
        ),
        miseEnService: {
          dateMiseEnService:
            avecDateMiseEnService === undefined
              ? undefined
              : avecDateMiseEnService
                ? Where.notEqualNull()
                : Where.equalNull(),
        },
      },
      join: [
        {
          entity: 'lauréat',
          on: 'identifiantProjet',
          where: {
            appelOffre: Where.equal(appelOffre),
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
          entity: 'achèvement',
          on: 'identifiantProjet',
          where:
            statutProjet === 'achevé'
              ? { estAchevé: Where.equal(true) }
              : statutProjet === 'actif'
                ? { estAchevé: Where.equal(false) }
                : undefined,
        },
      ],
      orderBy: {
        référence: 'ascending',
        identifiantProjet: 'ascending',
      },
      range,
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

  mediator.register('Lauréat.Raccordement.Query.ListerDossierRaccordementQuery', handler);
};

type MapToReadModelProps = (
  dossier: Raccordement.DossierRaccordementEntity & Joined<DossierRaccordementJoins>,
) => DossierRaccordement;

export const mapToReadModel: MapToReadModelProps = ({
  identifiantProjet,
  identifiantGestionnaireRéseau,
  référence,
  miseEnService,
  lauréat: { nomProjet, localité, notifiéLe },
  'gestionnaire-réseau': gestionnaireRéseau,
  puissance: { puissance },
  candidature: { emailContact, nomCandidat, sociétéMère, unitéPuissance },
  achèvement,
}) => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    nomProjet,
    localité: Localité.bind(localité),
    référenceDossier: RéférenceDossierRaccordement.convertirEnValueType(référence),
    dateMiseEnService: miseEnService
      ? DateTime.convertirEnValueType(miseEnService.dateMiseEnService)
      : undefined,
    identifiantGestionnaireRéseau:
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseau,
      ),
    raisonSocialeGestionnaireRéseau: gestionnaireRéseau.raisonSociale,
    puissance,
    unitéPuissance: UnitéPuissance.convertirEnValueType(unitéPuissance),
    dateNotification: DateTime.convertirEnValueType(notifiéLe),
    emailContact,
    nomCandidat,
    sociétéMère,
    statutProjet: achèvement.estAchevé ? StatutLauréat.achevé : StatutLauréat.actif,
    dateAchèvement: achèvement.réel?.date
      ? DateTime.convertirEnValueType(achèvement.réel.date)
      : undefined,
  };
};
