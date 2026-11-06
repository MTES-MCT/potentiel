import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime, Email } from '@potentiel-domain/common';
import {
  type Joined,
  type JoinOptionsParams,
  type LeftJoin,
  type List,
  Where,
  type WhereOptions,
} from '@potentiel-domain/entity';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import type { AccèsEntity } from '../../../accès/accès.entity.js';
import type { TypeDeTerrainDImplantation } from '../../../candidature/détail/détailCandidature.entity.js';
import {
  type CandidatureEntity,
  type DétailCandidatureEntity,
  Localité,
} from '../../../candidature/index.js';
import { Candidature, IdentifiantProjet } from '../../../index.js';
import type { ActionnaireEntity } from '../../actionnaire/actionnaire.entity.js';
import type { FournisseurEntity } from '../../fournisseur/fournisseur.entity.js';
import {
  type LauréatEntity,
  NatureDeLExploitation,
  Raccordement,
  ReprésentantLégal,
  StatutLauréat,
} from '../../index.js';
import type { InstallationEntity } from '../../installation/installation.entity.js';
import type { NatureDeLExploitationEntity } from '../../nature-de-l-exploitation/natureDeLExploitation.entity.js';
import type { ProducteurEntity } from '../../producteur/producteur.entity.js';
import type { PuissanceEntity } from '../../puissance/index.js';
import type { DossierRaccordementEntity, RaccordementEntity } from '../../raccordement/index.js';
import type { ReprésentantLégalEntity } from '../../représentantLégal/représentantLégal.entity.js';
import type { AchèvementEntity } from '../achèvement.entity.js';

type DossierRaccordementPourAchèvement = {
  référence: Raccordement.RéférenceDossierRaccordement.ValueType;
  dateDemandeComplète?: DateTime.ValueType;
  dateMiseEnService?: DateTime.ValueType;
};

export type DonnéesProjetPourAchèvementReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  nomCandidat: string;
  dateNotification: DateTime.ValueType;
  sociétéMère: string;
  siren?: string;
  siret?: string;
  dossiersRaccordement: Array<DossierRaccordementPourAchèvement>;
  puissance: number;
  puissanceInitiale: number;
  cahierDesCharges: AppelOffre.RéférenceCahierDesCharges.ValueType;
  localité: Localité.ValueType;
  représentantLégal?: {
    nom: string;
    type: ReprésentantLégal.TypeReprésentantLégal.ValueType;
  };
  emailPorteurs: Array<Email.ValueType>;
  typeActionnariat?: Candidature.TypeActionnariat.ValueType;
  prix: number;
  coefficientKChoisi: boolean;
  presenceDeTrackers?: boolean;
  gestionnaireRéseau?: {
    raisonSociale: string;
    identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  };
  typologieInstallation: Array<Candidature.TypologieInstallation.ValueType>;
  statut: StatutLauréat.ValueType;
  achèvementEnAttente: boolean;
  technologie: Candidature.TypeTechnologie.ValueType;
  coordonnéesGéodésiques?: { latitude: number; longitude: number };
  natureDeLExploitation?: {
    type: NatureDeLExploitation.TypeDeNatureDeLExploitation.ValueType;
    tauxPrévisionnelACI?: number;
    tauxPrévisionnelACC?: number;
  };
  évaluationCarboneSimplifiée?: number;
  typeDeTerrain?: TypeDeTerrainDImplantation;
  recours?: {
    dateDemande: DateTime.RawType;
    dateAccord: DateTime.RawType;
  };
};

export type DonnéesProjetPourAchèvementJoins = [
  LauréatEntity,
  CandidatureEntity,
  PuissanceEntity,
  LeftJoin<DétailCandidatureEntity>,
  LeftJoin<ActionnaireEntity>,
  LeftJoin<ProducteurEntity>,
  LeftJoin<ReprésentantLégalEntity>,
  LeftJoin<AccèsEntity>,
  LeftJoin<InstallationEntity>,
  LeftJoin<NatureDeLExploitationEntity>,
  LeftJoin<FournisseurEntity>,
  LeftJoin<RaccordementEntity>,
];

type GetDonnéesProjetPourAchèvementJoinProps = {
  whereLauréat?: WhereOptions<Omit<LauréatEntity, 'type'>>;
};

export const getDonnéesProjetPourAchèvementJoin = ({
  whereLauréat,
}: GetDonnéesProjetPourAchèvementJoinProps = {}): JoinOptionsParams<
  AchèvementEntity,
  DonnéesProjetPourAchèvementJoins
>['join'] => [
  { entity: 'lauréat', on: 'identifiantProjet', where: whereLauréat },
  { entity: 'candidature', on: 'identifiantProjet' },
  { entity: 'puissance', on: 'identifiantProjet' },
  { entity: 'détail-candidature', on: 'identifiantProjet', type: 'left' },
  { entity: 'actionnaire', on: 'identifiantProjet', type: 'left' },
  { entity: 'producteur', on: 'identifiantProjet', type: 'left' },
  { entity: 'représentant-légal', on: 'identifiantProjet', type: 'left' },
  { entity: 'accès', on: 'identifiantProjet', type: 'left' },
  { entity: 'installation', on: 'identifiantProjet', type: 'left' },
  { entity: 'nature-de-l-exploitation', on: 'identifiantProjet', type: 'left' },
  { entity: 'fournisseur', on: 'identifiantProjet', type: 'left' },
  { entity: 'raccordement', on: 'identifiantProjet', type: 'left' },
];

type ListerDonnéesRaccordementProps = {
  list: List;
  projets: ReadonlyArray<AchèvementEntity & Joined<DonnéesProjetPourAchèvementJoins>>;
};

export const listerDonnéesRaccordement = async ({
  list,
  projets,
}: ListerDonnéesRaccordementProps) => {
  const { items: dossiers } = await list<DossierRaccordementEntity>('dossier-raccordement', {
    where: {
      identifiantProjet: Where.matchAny(projets.map((projet) => projet.identifiantProjet)),
    },
    orderBy: { référence: 'ascending' },
  });

  const codeEICs = projets
    .map((projet) => projet.raccordement?.identifiantGestionnaireRéseau)
    .filter((codeEIC) => codeEIC !== undefined);

  const { items: gestionnaires } = await list<GestionnaireRéseau.GestionnaireRéseauEntity>(
    'gestionnaire-réseau',
    {
      where: {
        codeEIC: Where.matchAny(codeEICs),
      },
    },
  );

  return { dossiers, gestionnaires };
};

type MapToDonnéesProjetPourAchèvementReadModelProps = {
  projet: AchèvementEntity & Joined<DonnéesProjetPourAchèvementJoins>;
  dossiers: ReadonlyArray<DossierRaccordementEntity>;
  gestionnaires: ReadonlyArray<GestionnaireRéseau.GestionnaireRéseauEntity>;
};

export const mapToDonnéesProjetPourAchèvementReadModel = ({
  projet: {
    identifiantProjet,
    estAchevé,
    initiation,
    lauréat: { localité, nomProjet, notifiéLe, statut, cahierDesCharges, coordonnées },
    candidature: {
      nomCandidat,
      sociétéMère,
      prixReference,
      coefficientKChoisi,
      puissance: puissanceInitiale,
      actionnariat,
      technologie,
    },
    puissance: { puissance },
    'détail-candidature': détail,
    actionnaire,
    producteur,
    'représentant-légal': représentantLégal,
    accès,
    installation,
    'nature-de-l-exploitation': natureDeLExploitation,
    fournisseur,
    raccordement,
  },
  dossiers,
  gestionnaires,
}: MapToDonnéesProjetPourAchèvementReadModelProps): DonnéesProjetPourAchèvementReadModel => {
  const gestionnaire = gestionnaires.find(
    ({ codeEIC }) => codeEIC === raccordement?.identifiantGestionnaireRéseau,
  );

  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    nomProjet,
    nomCandidat,
    dateNotification: DateTime.convertirEnValueType(notifiéLe),
    sociétéMère: actionnaire?.actionnaire.nom ?? sociétéMère,
    siren: producteur?.numéroIdentification?.siren,
    siret: producteur?.numéroIdentification?.siret,
    dossiersRaccordement: dossiers
      .filter((dossier) => dossier.identifiantProjet === identifiantProjet)
      .map(({ référence, demandeComplèteRaccordement, miseEnService }) => ({
        référence: Raccordement.RéférenceDossierRaccordement.convertirEnValueType(référence),
        dateDemandeComplète: demandeComplèteRaccordement?.dateQualification
          ? DateTime.convertirEnValueType(demandeComplèteRaccordement.dateQualification)
          : undefined,
        dateMiseEnService: miseEnService
          ? DateTime.convertirEnValueType(miseEnService.dateMiseEnService)
          : undefined,
      })),
    puissance,
    puissanceInitiale,
    cahierDesCharges: AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(cahierDesCharges),
    localité: Localité.bind(localité),
    représentantLégal: représentantLégal
      ? {
          nom: représentantLégal.nomReprésentantLégal,
          type: ReprésentantLégal.TypeReprésentantLégal.convertirEnValueType(
            représentantLégal.typeReprésentantLégal,
          ),
        }
      : undefined,
    emailPorteurs:
      accès?.utilisateursAyantAccès.map((utilisateur) => Email.convertirEnValueType(utilisateur)) ??
      [],
    typeActionnariat: actionnariat
      ? Candidature.TypeActionnariat.convertirEnValueType(actionnariat)
      : undefined,
    prix: prixReference,
    coefficientKChoisi: !!coefficientKChoisi,
    presenceDeTrackers: détail?.pv?.trackers,
    gestionnaireRéseau: gestionnaire
      ? {
          raisonSociale: gestionnaire.raisonSociale,
          identifiantGestionnaireRéseau:
            GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
              gestionnaire.codeEIC,
            ),
        }
      : undefined,
    typologieInstallation:
      installation?.typologieInstallation?.map(
        Candidature.TypologieInstallation.convertirEnValueType,
      ) ?? [],
    statut: StatutLauréat.convertirEnValueType(statut),
    achèvementEnAttente: !!initiation && !estAchevé,
    technologie: Candidature.TypeTechnologie.convertirEnValueType(technologie),
    coordonnéesGéodésiques: coordonnées,
    natureDeLExploitation: natureDeLExploitation
      ? {
          type: NatureDeLExploitation.TypeDeNatureDeLExploitation.convertirEnValueType(
            natureDeLExploitation.typeNatureDeLExploitation,
          ),
          tauxPrévisionnelACI: natureDeLExploitation.tauxPrévisionnelACI,
          tauxPrévisionnelACC: natureDeLExploitation.tauxPrévisionnelACC,
        }
      : undefined,
    évaluationCarboneSimplifiée: fournisseur?.évaluationCarboneSimplifiée,
    typeDeTerrain: détail?.pv?.typeTerrainImplantation,
  };
};
