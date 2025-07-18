import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { DateTime, Email } from '@potentiel-domain/common';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { DossierRaccordementEntity, RéférenceDossierRaccordement } from '..';
import { LauréatEntity } from '../../lauréat.entity';
import {
  Candidature,
  GetProjetUtilisateurScope,
  IdentifiantProjet,
  Lauréat,
  StatutProjet,
} from '../../..';

type DossierRaccordement = {
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
  référenceDossier: RéférenceDossierRaccordement.ValueType;
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
  },
  ListerDossierRaccordementReadModel
>;

export type ListerDossierRaccordementQueryDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

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
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<DossierRaccordementEntity, LauréatEntity>('dossier-raccordement', {
      where: {
        identifiantProjet:
          scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
        référence: Where.contain(référenceDossier),
        identifiantGestionnaireRéseau: Where.equal(identifiantGestionnaireRéseau),
        miseEnService: {
          dateMiseEnService:
            avecDateMiseEnService === undefined
              ? undefined
              : avecDateMiseEnService
                ? Where.notEqualNull()
                : Where.equalNull(),
        },
      },
      join: {
        entity: 'lauréat',
        on: 'identifiantProjet',
        where: {
          appelOffre: Where.equal(appelOffre),
          localité: {
            région: scope.type === 'region' ? Where.equal(scope.region) : undefined,
          },
        },
      },
      orderBy: {
        référence: 'ascending',
        identifiantProjet: 'ascending',
      },
      range,
    });

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

    const identifiants = items.map(
      (dossier) => dossier.identifiantProjet as IdentifiantProjet.RawType,
    );

    const puissances = await list<Lauréat.Puissance.PuissanceEntity>('puissance', {
      where: {
        identifiantProjet: Where.matchAny(identifiants),
      },
    });

    const candidatures = await list<Candidature.CandidatureEntity, AppelOffre.AppelOffreEntity>(
      'candidature',
      {
        where: {
          identifiantProjet: Where.matchAny(identifiants),
        },
        join: {
          entity: 'appel-offre',
          on: 'appelOffre',
        },
      },
    );

    return {
      items: items.map((dossier) =>
        mapToReadModel({
          dossier,
          gestionnairesRéseau: gestionnairesRéseau.items,
          puissances: puissances.items,
          candidatures: candidatures.items,
        }),
      ),
      range: {
        endPosition,
        startPosition,
      },
      total,
    };
  };

  mediator.register('Lauréat.Raccordement.Query.ListerDossierRaccordementQuery', handler);
};

type MapToReadModelProps = (args: {
  dossier: Lauréat.Raccordement.DossierRaccordementEntity & Joined<LauréatEntity>;
  gestionnairesRéseau: ReadonlyArray<GestionnaireRéseau.GestionnaireRéseauEntity>;
  puissances: ReadonlyArray<Lauréat.Puissance.PuissanceEntity>;
  candidatures: ReadonlyArray<Candidature.CandidatureEntity & Joined<AppelOffre.AppelOffreEntity>>;
}) => DossierRaccordement;

export const mapToReadModel: MapToReadModelProps = ({
  dossier: { identifiantProjet, identifiantGestionnaireRéseau, référence, miseEnService, lauréat },
  gestionnairesRéseau,
  puissances,
  candidatures,
}) => {
  const { appelOffre, famille, numéroCRE, période } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);
  const gestionnaire = gestionnairesRéseau.find(
    (gestionnaireRéseau) => gestionnaireRéseau.codeEIC === identifiantGestionnaireRéseau,
  );

  const {
    nomProjet,
    localité: { codePostal, commune, département, région, adresse1, adresse2 },
    notifiéLe,
  } = lauréat;

  const candidature = candidatures.find(
    (candidature) => candidature.identifiantProjet === identifiantProjet,
  );

  const puissanceItem = puissances.find(
    (puissance) => puissance.identifiantProjet === identifiantProjet,
  );

  const unitéPuissance = candidature
    ? Candidature.UnitéPuissance.déterminer({
        appelOffres: candidature['appel-offre'],
        technologie: candidature.technologie,
        période,
      }).formatter()
    : 'N/A';

  const puissance = match(puissanceItem)
    .with(P.nullish, () => `0 ${unitéPuissance}`)
    .otherwise((value) => `${value.puissance} ${unitéPuissance}`);

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
    statutDGEC: StatutProjet.classé.statut,
    dateMiseEnService: miseEnService
      ? DateTime.convertirEnValueType(miseEnService.dateMiseEnService)
      : undefined,
    identifiantGestionnaireRéseau:
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseau,
      ),
    raisonSocialeGestionnaireRéseau: match(gestionnaire)
      .with(undefined, () => 'Gestionnaire réseau inconnu')
      .otherwise((value) => value.raisonSociale),
    puissance,

    dateNotification: notifiéLe,
    emailContact,
    nomCandidat,
    siteProduction: `${adresse1} ${adresse2} ${codePostal} ${commune} (${département}, ${région})`,
    sociétéMère,
  };
};
