import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { List, RangeOptions, Where } from '@potentiel-domain/entity';
import { DateTime } from '@potentiel-domain/common';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { RéférenceDossierRaccordement } from '..';
import { DossierRaccordementEntity } from '../raccordement.entity';
import * as StatutLauréat from '../../statutLauréat.valueType';
import { PuissanceEntity } from '../../puissance';

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
  statutDGEC: StatutLauréat.RawType;
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
    } = await list<DossierRaccordementEntity>('dossier-raccordement', {
      where: {
        identifiantGestionnaireRéseau: Where.equal(identifiantGestionnaireRéseau),
        miseEnService: {
          dateMiseEnService: Where.equalNull(),
        },
        projetNotifiéLe: Where.lessOrEqual(projetNotifiéAvant),
      },
      range,
      orderBy: {
        référence: 'ascending',
      },
    });

    const identifiants = items.map(
      (dossier) => dossier.identifiantProjet as IdentifiantProjet.RawType,
    );

    const candidatures = await list<Candidature.CandidatureEntity>('candidature', {
      where: {
        identifiantProjet: Where.matchAny(identifiants),
      },
    });

    const puissances = await list<PuissanceEntity>('puissance', {
      where: {
        identifiantProjet: Where.matchAny(identifiants),
      },
    });

    const appelOffres = await list<AppelOffre.AppelOffreEntity>('appel-offre', {});

    return {
      items: items.map((dossier) =>
        mapToReadModel({
          dossier,
          appelOffres: appelOffres.items,
          candidatures: candidatures.items,
          puissances: puissances.items,
        }),
      ),
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

type MapToReadModelProps = (args: {
  dossier: DossierRaccordementEntity;
  candidatures: ReadonlyArray<Candidature.CandidatureEntity>;
  puissances: ReadonlyArray<PuissanceEntity>;
  appelOffres: ReadonlyArray<AppelOffre.AppelOffreEntity>;
}) => DossierRaccordementEnAttenteMiseEnService;

export const mapToReadModel: MapToReadModelProps = ({
  dossier: { identifiantProjet, référence },
  candidatures,
  puissances,
  appelOffres,
}) => {
  const { appelOffre, famille, numéroCRE, période } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);
  const candidature = candidatures.find(
    (candidature) => candidature.identifiantProjet === identifiantProjet,
  );

  const {
    nomProjet,
    codePostal,
    commune,
    dateNotification,
    emailContact,
    nomCandidat,
    siteProduction,
    sociétéMère,
  } = match(candidature)
    .with(P.nullish, () => ({
      codePostal: 'Code postal inconnu',
      commune: 'Commune inconnue',
      nomProjet: 'Nom projet inconnu',
      nomCandidat: 'Nom candidat inconnu',
      sociétéMère: 'Société mère inconnue',
      emailContact: 'Email contactt inconnu',
      siteProduction: 'Site de production inconnu',
      dateNotification: 'Date de notification inconnue',
    }))
    .otherwise((value) => ({
      codePostal: value.localité.codePostal,
      commune: value.localité.commune,
      nomProjet: value.nomProjet,

      nomCandidat: value.nomCandidat,
      sociétéMère: value.sociétéMère,
      emailContact: value.emailContact,
      siteProduction: `${value.localité.adresse1} ${value.localité.adresse2} ${value.localité.codePostal} ${value.localité.commune} (${value.localité.département}, ${value.localité.région})`,
      dateNotification: value?.notification?.notifiéeLe || '',
    }));

  const puissanceItem = puissances.find(
    (puissance) => puissance.identifiantProjet === identifiantProjet,
  );

  const puissance = match(puissanceItem)
    .with(P.nullish, () => `0 ${unitéPuissance}`)
    .otherwise((value) => `${value.puissance} ${unitéPuissance}`);

  const unitéPuissance = appelOffres.find((ao) => ao.id === appelOffre)?.unitePuissance ?? 'MWc';

  return {
    appelOffre,
    codePostal,
    commune,
    famille,
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    nomProjet,
    numéroCRE,
    période,
    référenceDossier: RéférenceDossierRaccordement.convertirEnValueType(référence),
    statutDGEC: StatutLauréat.classé.formatter(),
    puissance,
    dateNotification,
    emailContact,
    nomCandidat,
    siteProduction,
    sociétéMère,
  };
};
