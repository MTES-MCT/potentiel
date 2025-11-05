import { Message, MessageHandler, mediator } from 'mediateur';

import { Joined, LeftJoin, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { DateTime, Email } from '@potentiel-domain/common';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { DossierRaccordementEntity, RéférenceDossierRaccordement } from '..';
import { Candidature, GetProjetUtilisateurScope, IdentifiantProjet } from '../../..';
import { LauréatEntity, Puissance, Raccordement, StatutLauréat } from '../..';
import { AbandonEntity } from '../../abandon';
import { AttestationConformitéEntity } from '../../achèvement/attestationConformité';

type DossierRaccordement = {
  nomProjet: string;
  identifiantProjet: IdentifiantProjet.ValueType;
  statutProjet: StatutLauréat.ValueType;
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  commune: string;
  département: string;
  région: string;
  codePostal: string;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  statutDGEC: StatutLauréat.RawType;
  dateMiseEnService?: DateTime.ValueType;
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  raisonSocialeGestionnaireRéseau: string;
  puissance: string;

  nomCandidat: string;
  sociétéMère: string;
  emailContact: string;
  siteProduction: string;
  dateNotification: string;
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
  LeftJoin<AbandonEntity>,
  LeftJoin<AttestationConformitéEntity>,
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
          entity: 'abandon',
          on: 'identifiantProjet',
          type: 'left',
          where:
            statutProjet === 'abandonné'
              ? { statut: Where.equal('accordé') }
              : statutProjet === 'actif'
                ? { statut: Where.notEqual('accordé') }
                : undefined,
        },
        {
          entity: 'attestation-conformité',
          on: 'identifiantProjet',
          type: 'left',
          where:
            statutProjet === 'achevé'
              ? { identifiantProjet: Where.notEqualNull() }
              : statutProjet === 'actif'
                ? { identifiantProjet: Where.equalNull() }
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
  lauréat: {
    nomProjet,
    localité: { codePostal, commune, département, région, adresse1, adresse2 },
    notifiéLe,
  },
  'gestionnaire-réseau': gestionnaireRéseau,
  puissance: { puissance },
  candidature: { emailContact, nomCandidat, sociétéMère, unitéPuissance },
  abandon,
  'attestation-conformité': attestationConformité,
}) => {
  const { appelOffre, famille, numéroCRE, période } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);

  return {
    appelOffre,
    codePostal,
    commune,
    département,
    région,
    famille,
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    nomProjet,
    numéroCRE,
    période,
    référenceDossier: RéférenceDossierRaccordement.convertirEnValueType(référence),
    statutDGEC: StatutLauréat.actif.statut,
    dateMiseEnService: miseEnService
      ? DateTime.convertirEnValueType(miseEnService.dateMiseEnService)
      : undefined,
    identifiantGestionnaireRéseau:
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseau,
      ),
    raisonSocialeGestionnaireRéseau: gestionnaireRéseau.raisonSociale,
    puissance: `${puissance} ${unitéPuissance}`,

    dateNotification: notifiéLe,
    emailContact,
    nomCandidat,
    siteProduction: `${adresse1} ${adresse2} ${codePostal} ${commune} (${département}, ${région})`,
    sociétéMère,
    statutProjet:
      abandon?.statut === 'accordé'
        ? StatutLauréat.abandonné
        : attestationConformité
          ? StatutLauréat.achevé
          : StatutLauréat.actif,
  };
};
