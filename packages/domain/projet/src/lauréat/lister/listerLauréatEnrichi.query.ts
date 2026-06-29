import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime, Email } from '@potentiel-domain/common';
import { type Joined, type LeftJoin, type List, Where } from '@potentiel-domain/entity';
import type { GestionnaireRéseau } from '@potentiel-domain/reseau';

import {
  type CandidatureEntity,
  type Coordonnées,
  type Dépôt,
  type DétailCandidatureEntity,
  type Localité,
  TypeActionnariat,
  TypologieInstallation,
  UnitéPuissance,
} from '../../candidature/index.js';
import { type GetScopeProjetUtilisateur, IdentifiantProjet } from '../../index.js';
import { getCoefficientKLauréat } from '../_helpers/getCoefficientKLauréat.js';
import type { AchèvementEntity } from '../achèvement/index.js';
import type { ActionnaireEntity } from '../actionnaire/index.js';
import { type Actionnaire, Producteur, StatutLauréat } from '../index.js';
import { DispositifDeStockage, type InstallationEntity } from '../installation/index.js';
import type { LauréatEntity } from '../lauréat.entity.js';
import {
  type NatureDeLExploitationEntity,
  TypeDeNatureDeLExploitation,
} from '../nature-de-l-exploitation/index.js';
import type { PowerPurchaseAgreementEntity } from '../power-purchase-agreement/powerPurchaseAgreement.entity.js';
import type { ProducteurEntity } from '../producteur/producteur.entity.js';
import type { PuissanceEntity } from '../puissance/index.js';
import { type RaccordementEntity, RéférenceDossierRaccordement } from '../raccordement/index.js';

export type LauréatEnrichiListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: IdentifiantProjet.ValueType['appelOffre'];
  période: IdentifiantProjet.ValueType['période'];
  famille: IdentifiantProjet.ValueType['famille'] | undefined;
  numéroCRE: IdentifiantProjet.ValueType['numéroCRE'];
  nomProjet: Dépôt.ValueType['nomProjet'];
  statut: StatutLauréat.ValueType;
  technologie: AppelOffre.Technologie;
  estPartiEnPPA?: true;

  adresse1: Localité.ValueType['adresse1'];
  adresse2: Localité.ValueType['adresse2'];
  commune: Localité.ValueType['commune'];
  codePostal: Localité.ValueType['codePostal'];
  département: Localité.ValueType['département'];
  région: Localité.ValueType['région'];

  latitude?: Coordonnées.RawType['latitude'];
  longitude?: Coordonnées.RawType['longitude'];

  siren: Producteur.NuméroIdentification.ValueType['siren'] | undefined;
  siret: Producteur.NuméroIdentification.ValueType['siret'] | undefined;

  actionnaire: Actionnaire.ConsulterActionnaireReadModel['actionnaire'];

  typeActionnariat: TypeActionnariat.ValueType | undefined;

  raisonSocialeGestionnaireRéseau:
    | GestionnaireRéseau.ConsulterGestionnaireRéseauReadModel['raisonSociale']
    | undefined;

  dateAchèvementPrévisionnelle: DateTime.ValueType | undefined;
  dateAchèvementRéelle: DateTime.ValueType | undefined;

  dateMiseEnService: DateTime.ValueType | undefined;
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType | undefined;

  prixReference: Dépôt.ValueType['prixReference'];
  numéroAutorisation: string | undefined;

  puissance: PuissanceEntity['puissance'];
  puissanceDeSite: PuissanceEntity['puissanceDeSite'];
  unitéPuissance: UnitéPuissance.ValueType;

  coefficientKChoisi: Dépôt.ValueType['coefficientKChoisi'];
  typologieInstallation: Array<TypologieInstallation.ValueType> | undefined;
  installateur: string | undefined;
  installationAvecDispositifDeStockage:
    | DispositifDeStockage.ValueType['installationAvecDispositifDeStockage']
    | undefined;
  puissanceDuDispositifDeStockageEnKW:
    | DispositifDeStockage.ValueType['puissanceDuDispositifDeStockageEnKW']
    | undefined;
  capacitéDuDispositifDeStockageEnKWh:
    | DispositifDeStockage.ValueType['puissanceDuDispositifDeStockageEnKW']
    | undefined;
  typeNatureDeLExploitation: TypeDeNatureDeLExploitation.ValueType | undefined;
  tauxPrévisionnelACI: NatureDeLExploitationEntity['tauxPrévisionnelACI'] | undefined;
  tauxPrévisionnelACC: NatureDeLExploitationEntity['tauxPrévisionnelACC'] | undefined;

  composantsRésilients: string | undefined;
  typeTerrainImplantation: string | undefined;
  surfaceProjetéeAuSol: string | undefined;
  surfaceTotaleTerrainImplantation: string | undefined;
  natureExacteDuTerrain: string | undefined;
  dateObtentionCETI: string | undefined;

  technologieÉolien: string | undefined;
  diamètreRotorEnMètres: string | undefined;
  hauteurBoutDePâleEnMètres: string | undefined;
  installationRenouvelée: string | undefined;
  puissanceDuProjetInitial: number | undefined;
  nombreDAérogénérateurs: string | undefined;
  puissanceUnitaireDesAérogénérateurs: string | undefined;
};

export type ListerLauréatEnrichiReadModel = {
  items: ReadonlyArray<LauréatEnrichiListItemReadModel>;
};

export type ListerLauréatEnrichiQuery = Message<
  'Lauréat.Query.ListerLauréatEnrichi',
  {
    utilisateur: Email.RawType;
    statut?: Array<StatutLauréat.RawType>;
    appelOffre?: Array<string>;
    periode?: string;
    famille?: string;
    identifiantProjet?: IdentifiantProjet.RawType;
    typeActionnariat?: Array<TypeActionnariat.RawType>;
    estPartiEnPPA?: boolean;
  },
  ListerLauréatEnrichiReadModel
>;

export type ListerLauréatEnrichiDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
};

type LauréatEnrichiJoins = [
  CandidatureEntity,
  PuissanceEntity,
  ActionnaireEntity,
  AchèvementEntity,
  ProducteurEntity,
  LeftJoin<DétailCandidatureEntity>,
  LeftJoin<RaccordementEntity>,
  LeftJoin<InstallationEntity>,
  LeftJoin<NatureDeLExploitationEntity>,
  LeftJoin<PowerPurchaseAgreementEntity>,
];

export const registerListerLauréatEnrichiQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerLauréatEnrichiDependencies) => {
  const handler: MessageHandler<ListerLauréatEnrichiQuery> = async ({
    utilisateur,
    appelOffre,
    periode,
    famille,
    identifiantProjet,
    statut,
    typeActionnariat,
    estPartiEnPPA,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur), {
      identifiantProjets: identifiantProjet && [identifiantProjet],
    });

    const appelsOffres = await list<AppelOffre.AppelOffreEntity>('appel-offre');

    const lauréats = await list<LauréatEntity, LauréatEnrichiJoins>('lauréat', {
      orderBy: {
        identifiantProjet: 'ascending',
      },
      where: {
        identifiantProjet: Where.matchAny(scope.identifiantProjets),
        appelOffre: appelOffre?.length ? Where.matchAny(appelOffre) : undefined,
        statut: statut?.length ? Where.matchAny(statut) : undefined,
        période: Where.equal(periode),
        famille: Where.equal(famille),
        localité: { région: Where.matchAny(scope.régions) },
      },
      join: [
        {
          entity: 'candidature',
          on: 'identifiantProjet',
          where: {
            actionnariat: Where.matchAny(
              TypeActionnariat.getTypeActionnariaWhereConditionsForQuery(typeActionnariat),
            ),
          },
        },
        {
          entity: 'puissance',
          on: 'identifiantProjet',
        },
        {
          entity: 'actionnaire',
          on: 'identifiantProjet',
        },
        {
          entity: 'achèvement',
          on: 'identifiantProjet',
        },
        {
          entity: 'producteur',
          on: 'identifiantProjet',
        },
        { entity: 'détail-candidature', on: 'identifiantProjet', type: 'left' },
        { entity: 'raccordement', on: 'identifiantProjet', type: 'left' },
        {
          entity: 'installation',
          on: 'identifiantProjet',
          type: 'left',
        },
        {
          entity: 'nature-de-l-exploitation',
          on: 'identifiantProjet',
          type: 'left',
        },
        {
          entity: 'power-purchase-agreement',
          on: 'identifiantProjet',
          type: 'left',
          where: {
            signaléLe:
              estPartiEnPPA === true
                ? Where.notEqualNull()
                : estPartiEnPPA === false
                  ? Where.equalNull()
                  : undefined,
          },
        },
      ],
    });

    const gestionnairesRéseau = await list<GestionnaireRéseau.GestionnaireRéseauEntity>(
      'gestionnaire-réseau',
      { select: ['raisonSociale', 'codeEIC'] },
    );

    const gestionnaireRéseauMap = new Map(
      gestionnairesRéseau.items.map((gr) => [gr.codeEIC, gr.raisonSociale]),
    );

    return {
      items: lauréats.items.map((lauréat) =>
        mapToReadModel({
          lauréat,
          gestionnaireRéseau: lauréat.raccordement
            ? gestionnaireRéseauMap.get(lauréat.raccordement.identifiantGestionnaireRéseau)
            : undefined,
          appelOffre: appelsOffres.items.find(
            (ao) => ao.id === lauréat.appelOffre,
          ) as AppelOffre.AppelOffreEntity,
        }),
      ),
    };
  };

  mediator.register('Lauréat.Query.ListerLauréatEnrichi', handler);
};

type MapToReadModelProps = (args: {
  gestionnaireRéseau?: GestionnaireRéseau.GestionnaireRéseauEntity['raisonSociale'];
  lauréat: LauréatEntity & Joined<LauréatEnrichiJoins>;
  appelOffre: AppelOffre.AppelOffreEntity;
}) => LauréatEnrichiListItemReadModel;

const mapToReadModel: MapToReadModelProps = ({
  lauréat: {
    nomProjet,
    identifiantProjet,
    localité,
    coordonnées,
    statut,
    puissance: { puissance, puissanceDeSite },
    producteur: { numéroIdentification },
    candidature: {
      prixReference,
      unitéPuissance,
      actionnariat,
      coefficientKChoisi,
      autorisation,
      puissanceDuProjetInitial,
      technologieCalculée,
    },
    achèvement,
    'power-purchase-agreement': powerPurchaseAgreement,
    actionnaire,
    'détail-candidature': détail,
    installation,
    'nature-de-l-exploitation': natureDeLExploitation,
    raccordement,
    cahierDesCharges,
  },
  gestionnaireRéseau,
  appelOffre,
}) => {
  const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);
  const statutValueType = StatutLauréat.convertirEnValueType(statut);

  const dispositifDeStockageValueType = installation?.dispositifDeStockage
    ? DispositifDeStockage.convertirEnValueType(installation.dispositifDeStockage)
    : undefined;

  const numéroIdentificationValueType = numéroIdentification
    ? Producteur.NuméroIdentification.convertirEnValueType(numéroIdentification)
    : undefined;

  return {
    identifiantProjet: identifiantProjetValueType,
    appelOffre: identifiantProjetValueType.appelOffre,
    période: identifiantProjetValueType.période,
    famille: identifiantProjetValueType.famille,
    numéroCRE: identifiantProjetValueType.numéroCRE,
    nomProjet,
    statut: statutValueType,
    estPartiEnPPA: powerPurchaseAgreement ? true : undefined,
    technologie: technologieCalculée,
    ...localité,
    ...coordonnées,
    actionnaire: actionnaire.actionnaire.nom,

    siren: numéroIdentificationValueType ? numéroIdentificationValueType.siren : undefined,
    siret: numéroIdentificationValueType ? numéroIdentificationValueType.siret : undefined,

    typeActionnariat: actionnariat
      ? TypeActionnariat.convertirEnValueType(actionnariat)
      : undefined,

    raisonSocialeGestionnaireRéseau: gestionnaireRéseau,

    dateAchèvementPrévisionnelle:
      achèvement && DateTime.convertirEnValueType(achèvement.prévisionnel.date),
    dateAchèvementRéelle: achèvement?.réel && DateTime.convertirEnValueType(achèvement.réel.date),

    dateMiseEnService: raccordement?.miseEnService?.date
      ? DateTime.convertirEnValueType(raccordement.miseEnService.date)
      : undefined,
    référenceDossierRaccordement: raccordement?.miseEnService?.référenceDossierRaccordement
      ? RéférenceDossierRaccordement.convertirEnValueType(
          raccordement.miseEnService.référenceDossierRaccordement,
        )
      : undefined,

    prixReference,
    coefficientKChoisi: getCoefficientKLauréat({
      identifiantPériode: identifiantProjetValueType.période,
      identifiantFamille: identifiantProjetValueType.famille,
      référenceCDC: cahierDesCharges,
      appelOffre,
      coefficientKChoisi,
      technologie: technologieCalculée,
    }),
    numéroAutorisation: autorisation?.numéro,

    puissance,
    puissanceDeSite,
    unitéPuissance: UnitéPuissance.convertirEnValueType(unitéPuissance),
    puissanceDuProjetInitial,

    installateur: installation?.installateur,
    installationAvecDispositifDeStockage:
      dispositifDeStockageValueType?.installationAvecDispositifDeStockage,
    puissanceDuDispositifDeStockageEnKW:
      dispositifDeStockageValueType?.puissanceDuDispositifDeStockageEnKW,
    capacitéDuDispositifDeStockageEnKWh:
      dispositifDeStockageValueType?.capacitéDuDispositifDeStockageEnKWh,
    typologieInstallation: installation?.typologieInstallation
      ? installation.typologieInstallation.map(TypologieInstallation.convertirEnValueType)
      : undefined,
    typeNatureDeLExploitation: natureDeLExploitation
      ? TypeDeNatureDeLExploitation.convertirEnValueType(
          natureDeLExploitation.typeNatureDeLExploitation,
        )
      : undefined,
    typeTerrainImplantation: détail?.pv?.typeTerrainImplantation,
    tauxPrévisionnelACI: natureDeLExploitation?.tauxPrévisionnelACI,
    tauxPrévisionnelACC: natureDeLExploitation?.tauxPrévisionnelACC,
    composantsRésilients: détail?.pv?.composantsRésilients,
    surfaceProjetéeAuSol: détail?.pv?.surfaceProjetéeAuSol,
    surfaceTotaleTerrainImplantation: détail?.pv?.surfaceTotaleTerrainImplantation,
    natureExacteDuTerrain: détail?.pv?.natureExacteDuTerrain,
    dateObtentionCETI: détail?.pv?.dateObtentionCETI,
    technologieÉolien: détail?.éolien?.technologie,
    diamètreRotorEnMètres: détail?.éolien?.diamètreRotorEnMètres?.toString(),
    hauteurBoutDePâleEnMètres: détail?.éolien?.hauteurBoutDePâleEnMètres?.toString(),
    installationRenouvelée:
      détail?.éolien?.installationRenouvelée === true
        ? 'oui'
        : détail?.éolien?.installationRenouvelée === false
          ? 'non'
          : undefined,
    nombreDAérogénérateurs: détail?.éolien?.nombreDAérogénérateurs?.toString(),
    puissanceUnitaireDesAérogénérateurs:
      détail?.éolien?.puissanceUnitaireDesAérogénérateurs?.toString(),
  };
};
