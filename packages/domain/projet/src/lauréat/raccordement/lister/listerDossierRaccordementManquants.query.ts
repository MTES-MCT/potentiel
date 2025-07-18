import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { RaccordementEntity } from '../raccordement.entity';
import { Puissance } from '../..';
import { Candidature, IdentifiantProjet, Lauréat, StatutProjet } from '../../..';

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
    } = await list<RaccordementEntity, Candidature.CandidatureEntity>('raccordement', {
      where: {
        identifiantGestionnaireRéseau: Where.equal(identifiantGestionnaireRéseau),
        dossiers: Where.isEmptyArray(),
      },
      range,
      orderBy: {
        identifiantProjet: 'ascending',
      },
      join: {
        entity: 'candidature',
        on: 'identifiantProjet',
      },
    });

    const identifiants = items.map(
      (dossier) => dossier.identifiantProjet as IdentifiantProjet.RawType,
    );

    const puissances = await list<Puissance.PuissanceEntity>('puissance', {
      where: {
        identifiantProjet: Where.matchAny(identifiants),
      },
    });

    const appelsOffres = await list<AppelOffre.AppelOffreEntity>('appel-offre', {});

    const identifiantsGestionnaireRéseau = items.map(
      (dossier) =>
        dossier.identifiantGestionnaireRéseau as GestionnaireRéseau.IdentifiantGestionnaireRéseau.RawType,
    );

    const gestionnairesRéseau = await list<GestionnaireRéseau.GestionnaireRéseauEntity>(
      'gestionnaire-réseau',
      {
        where: {
          codeEIC: Where.matchAny(identifiantsGestionnaireRéseau),
        },
      },
    );

    return {
      items: items.map((raccordement) =>
        mapToReadModel({
          raccordement,
          appelsOffres: appelsOffres.items,
          puissances: puissances.items,
          gestionnairesRéseau: gestionnairesRéseau.items,
        }),
      ),
      range: {
        endPosition,
        startPosition,
      },
      total,
    };
  };

  mediator.register('Lauréat.Raccordement.Query.ListerDossierRaccordementManquantsQuery', handler);
};

type MapToReadModelProps = (args: {
  raccordement: RaccordementEntity & Joined<Candidature.CandidatureEntity>;
  puissances: ReadonlyArray<Lauréat.Puissance.PuissanceEntity>;
  gestionnairesRéseau: ReadonlyArray<GestionnaireRéseau.GestionnaireRéseauEntity>;
  appelsOffres: ReadonlyArray<AppelOffre.AppelOffreEntity>;
}) => DossierRaccordementManquant;

export const mapToReadModel: MapToReadModelProps = ({
  raccordement: { identifiantProjet, candidature, identifiantGestionnaireRéseau },
  puissances,
  appelsOffres,
  gestionnairesRéseau,
}) => {
  const { appelOffre, famille, numéroCRE, période } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);

  const puissanceItem = puissances.find(
    (puissance) => puissance.identifiantProjet === identifiantProjet,
  );
  const appelOffres = appelsOffres.find((ao) => ao.id === candidature.appelOffre);

  const unitéPuissance = appelOffres
    ? Candidature.UnitéPuissance.déterminer({
        appelOffres,
        période: candidature.période,
        technologie: candidature.technologie,
      }).formatter()
    : 'N/A';

  const puissance = match(puissanceItem)
    .with(P.nullish, () => `0 ${unitéPuissance}`)
    .otherwise((value) => `${value.puissance} ${unitéPuissance}`);
  const gestionnaire = gestionnairesRéseau.find(
    (gestionnaireRéseau) => gestionnaireRéseau.codeEIC === identifiantGestionnaireRéseau,
  );

  return {
    appelOffre,
    famille,
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    numéroCRE,
    période,
    référenceDossier: Option.none,
    statutDGEC: StatutProjet.classé.statut,
    puissance,
    codePostal: candidature.localité.codePostal,
    commune: candidature.localité.commune,
    nomProjet: candidature.nomProjet,

    nomCandidat: candidature.nomCandidat,
    sociétéMère: candidature.sociétéMère,
    emailContact: candidature.emailContact,
    siteProduction: `${candidature.localité.adresse1} ${candidature.localité.adresse2} ${candidature.localité.codePostal} ${candidature.localité.commune} (${candidature.localité.département}, ${candidature.localité.région})`,
    département: candidature.localité.département,
    région: candidature.localité.région,
    dateNotification: candidature?.notification?.notifiéeLe || '',
    dateMiseEnService: undefined,
    identifiantGestionnaireRéseau:
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseau,
      ),
    raisonSocialeGestionnaireRéseau: match(gestionnaire)
      .with(undefined, () => 'Gestionnaire réseau inconnu')
      .otherwise((value) => value.raisonSociale),
  };
};
