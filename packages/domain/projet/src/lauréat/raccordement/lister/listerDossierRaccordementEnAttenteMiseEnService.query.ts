import { Message, MessageHandler, mediator } from 'mediateur';

import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { DateTime } from '@potentiel-domain/common';

import { Candidature, IdentifiantProjet, StatutProjet } from '../../..';
import { DossierRaccordementEntity, RéférenceDossierRaccordement } from '..';
import { LauréatEntity } from '../../lauréat.entity';
import { Puissance } from '../..';

type DossierRaccordementEnAttenteMiseEnService = {
  nomProjet: string;
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  commune: string;
  codePostal: string;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  statutDGEC: StatutProjet.RawType;
  puissance: string;

  nomCandidat: string;
  sociétéMère: string;
  emailContact: string;
  siteProduction: string;
  dateNotification: string;
};

export type ListerDossierRaccordementEnAttenteMiseEnServiceReadModel = {
  items: Array<DossierRaccordementEnAttenteMiseEnService>;
  range: RangeOptions;
  total: number;
};

export type ListerDossierRaccordementEnAttenteMiseEnServiceQuery = Message<
  'Lauréat.Raccordement.Query.ListerDossierRaccordementEnAttenteMiseEnServiceQuery',
  {
    identifiantGestionnaireRéseau: string;
    projetNotifiéAvant?: DateTime.RawType;
    range?: RangeOptions;
  },
  ListerDossierRaccordementEnAttenteMiseEnServiceReadModel
>;

export type ConsulterDossierRaccordementDependencies = {
  list: List;
};

type ListerDossierRaccordementEnAttenteMiseEnServiceJoins = [
  LauréatEntity,
  Candidature.CandidatureEntity,
  Puissance.PuissanceEntity,
];
export const registerListerDossierRaccordementEnAttenteMiseEnServiceQuery = ({
  list,
}: ConsulterDossierRaccordementDependencies) => {
  const handler: MessageHandler<ListerDossierRaccordementEnAttenteMiseEnServiceQuery> = async ({
    identifiantGestionnaireRéseau,
    projetNotifiéAvant,
    range,
  }) => {
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<DossierRaccordementEntity, ListerDossierRaccordementEnAttenteMiseEnServiceJoins>(
      'dossier-raccordement',
      {
        where: {
          identifiantGestionnaireRéseau: Where.equal(identifiantGestionnaireRéseau),
          miseEnService: {
            dateMiseEnService: Where.equalNull(),
          },
          projetNotifiéLe: Where.lessOrEqual(projetNotifiéAvant),
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
        ],
        range,
        orderBy: {
          référence: 'ascending',
        },
      },
    );

    return {
      items: items.map((dossier) => mapToReadModel(dossier)),
      range: {
        endPosition,
        startPosition,
      },
      total,
    };
  };

  mediator.register(
    'Lauréat.Raccordement.Query.ListerDossierRaccordementEnAttenteMiseEnServiceQuery',
    handler,
  );
};

type MapToReadModelProps = (
  dossier: DossierRaccordementEntity & Joined<ListerDossierRaccordementEnAttenteMiseEnServiceJoins>,
) => DossierRaccordementEnAttenteMiseEnService;

export const mapToReadModel: MapToReadModelProps = ({
  identifiantProjet,
  référence,
  lauréat,
  candidature: { unitéPuissance, emailContact, nomCandidat, sociétéMère },
  puissance: { puissance },
}) => {
  const { appelOffre, famille, numéroCRE, période } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);

  return {
    appelOffre,
    codePostal: lauréat.localité.codePostal,
    commune: lauréat.localité.commune,
    famille,
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    nomProjet: lauréat.nomProjet,
    numéroCRE,
    période,
    référenceDossier: RéférenceDossierRaccordement.convertirEnValueType(référence),
    statutDGEC: StatutProjet.classé.statut,
    puissance: `${puissance} ${unitéPuissance}`,
    dateNotification: lauréat.notifiéLe,
    emailContact,
    nomCandidat,
    siteProduction: `${lauréat.localité.adresse1} ${lauréat.localité.adresse2} ${lauréat.localité.codePostal} ${lauréat.localité.commune} (${lauréat.localité.département}, ${lauréat.localité.région})`,
    sociétéMère,
  };
};
