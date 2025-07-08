import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { DateTime } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';

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
    } = await list<DossierRaccordementEntity, LauréatEntity>('dossier-raccordement', {
      where: {
        identifiantGestionnaireRéseau: Where.equal(identifiantGestionnaireRéseau),
        miseEnService: {
          dateMiseEnService: Where.equalNull(),
        },
        projetNotifiéLe: Where.lessOrEqual(projetNotifiéAvant),
      },
      join: {
        entity: 'lauréat',
        on: 'identifiantProjet',
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

    const puissances = await list<Puissance.PuissanceEntity>('puissance', {
      where: {
        identifiantProjet: Where.matchAny(identifiants),
      },
    });

    const appelsOffres = await list<AppelOffre.AppelOffreEntity>('appel-offre', {});

    return {
      items: items.map((dossier) =>
        mapToReadModel({
          dossier,
          appelsOffres: appelsOffres.items,
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
  dossier: DossierRaccordementEntity & Joined<LauréatEntity>;
  candidatures: ReadonlyArray<Candidature.CandidatureEntity>;
  puissances: ReadonlyArray<Puissance.PuissanceEntity>;
  appelsOffres: ReadonlyArray<AppelOffre.AppelOffreEntity>;
}) => DossierRaccordementEnAttenteMiseEnService;

export const mapToReadModel: MapToReadModelProps = ({
  dossier: { identifiantProjet, référence, lauréat },
  candidatures,
  puissances,
  appelsOffres,
}) => {
  const { appelOffre, famille, numéroCRE, période } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);
  const candidature = candidatures.find(
    (candidature) => candidature.identifiantProjet === identifiantProjet,
  );

  const appelOffres = appelsOffres.find((ao) => ao.id === appelOffre);
  const { emailContact, nomCandidat, sociétéMère } = match(candidature)
    .with(P.nullish, () => ({
      nomCandidat: 'Nom candidat inconnu',
      sociétéMère: 'Société mère inconnue',
      emailContact: 'Email contact inconnu',
    }))
    .otherwise((value) => ({
      nomCandidat: value.nomCandidat,
      sociétéMère: value.sociétéMère,
      emailContact: value.emailContact,
    }));

  const unitéPuissance =
    appelOffres && candidature
      ? Candidature.UnitéPuissance.déterminer({
          appelOffres,
          période,
          technologie: candidature?.technologie,
        }).formatter()
      : 'N/A';
  const puissanceItem = puissances.find(
    (puissance) => puissance.identifiantProjet === identifiantProjet,
  );

  const puissance = match(puissanceItem)
    .with(P.nullish, () => `0 ${unitéPuissance}`)
    .otherwise((value) => `${value.puissance} ${unitéPuissance}`);

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
    puissance,
    dateNotification: lauréat.notifiéLe,
    emailContact,
    nomCandidat,
    siteProduction: `${lauréat.localité.adresse1} ${lauréat.localité.adresse2} ${lauréat.localité.codePostal} ${lauréat.localité.commune} (${lauréat.localité.département}, ${lauréat.localité.région})`,
    sociétéMère,
  };
};
