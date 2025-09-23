import { Message, MessageHandler, mediator } from 'mediateur';

import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { RaccordementEntity } from '../raccordement.entity';
import { LauréatEntity, Puissance } from '../..';
import { Candidature, IdentifiantProjet, StatutProjet } from '../../..';

type DossierRaccordementManquant = {
  référenceDossier: Option.None;

  nomProjet: string;
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  commune: string;
  département: string;
  région: string;
  codePostal: string;
  statutDGEC: StatutProjet.RawType;
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

export type ListerDossierRaccordementManquantsReadModel = {
  items: Array<DossierRaccordementManquant>;
  range: RangeOptions;
  total: number;
};

export type ListerDossierRaccordementManquantsQuery = Message<
  'Lauréat.Raccordement.Query.ListerDossierRaccordementManquantsQuery',
  {
    identifiantGestionnaireRéseau?: string;
    range?: RangeOptions;
  },
  ListerDossierRaccordementManquantsReadModel
>;

export type ConsulterDossierRaccordementDependencies = {
  list: List;
};

type ListerDossierRaccordementManquantJoins = [
  LauréatEntity,
  Candidature.CandidatureEntity,
  Puissance.PuissanceEntity,
  GestionnaireRéseau.GestionnaireRéseauEntity,
];
export const registerListerDossierRaccordementManquantsQuery = ({
  list,
}: ConsulterDossierRaccordementDependencies) => {
  const handler: MessageHandler<ListerDossierRaccordementManquantsQuery> = async ({
    identifiantGestionnaireRéseau,
    range,
  }) => {
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<RaccordementEntity, ListerDossierRaccordementManquantJoins>('raccordement', {
      where: {
        identifiantGestionnaireRéseau: Where.equal(identifiantGestionnaireRéseau),
        dossiers: Where.isEmptyArray(),
      },
      range,
      orderBy: {
        identifiantProjet: 'ascending',
      },
      join: [
        {
          entity: 'lauréat',
          on: 'identifiantProjet',
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
  candidature: {
    unitéPuissanceCalculée,
    nomProjet,
    nomCandidat,
    sociétéMère,
    localité,
    emailContact,
    notification,
  },
  identifiantGestionnaireRéseau,
  puissance: { puissance },
  'gestionnaire-réseau': gestionnaireRéseau,
}) => {
  const { appelOffre, famille, numéroCRE, période } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);

  return {
    appelOffre,
    famille,
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    numéroCRE,
    période,
    référenceDossier: Option.none,
    statutDGEC: StatutProjet.classé.statut,
    puissance: `${puissance} ${unitéPuissanceCalculée}`,
    codePostal: localité.codePostal,
    commune: localité.commune,
    nomProjet,

    nomCandidat,
    sociétéMère,
    emailContact,
    siteProduction: `${localité.adresse1} ${localité.adresse2} ${localité.codePostal} ${localité.commune} (${localité.département}, ${localité.région})`,
    département: localité.département,
    région: localité.région,
    dateNotification: notification?.notifiéeLe || '',
    dateMiseEnService: undefined,
    identifiantGestionnaireRéseau:
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseau,
      ),
    raisonSocialeGestionnaireRéseau: gestionnaireRéseau.raisonSociale,
  };
};
