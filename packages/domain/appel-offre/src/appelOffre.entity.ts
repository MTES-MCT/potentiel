import { Entity } from '@potentiel-domain/entity';

import { DateParutionCahierDesChargesModifié } from './référenceCahierDesCharges.valueType';

type AppelOffreTypes =
  | 'autoconso'
  | 'batiment'
  | 'eolien'
  | 'innovation'
  | 'neutre'
  | 'sol'
  | 'zni'
  | 'autre';

export type Ratios = {
  min: number;
  max: number;
};

const emailsDGEC = [
  'aoeolien@developpement-durable.gouv.fr',
  'aopv.dgec@developpement-durable.gouv.fr',
] as const;
type EmailDGEC = (typeof emailsDGEC)[number];

// Type des Garanties Financières
export type TypeGarantiesFinancières =
  | 'consignation'
  | 'avec-date-échéance'
  | 'six-mois-après-achèvement'
  | 'type-inconnu'
  | 'exemption';

// GF AO
type GarantiesFinancièresAppelOffre = {
  typeGarantiesFinancièresDisponibles: Array<TypeGarantiesFinancières>;
  renvoiRetraitDesignationGarantieFinancieres: string;
  renvoiSoumisAuxGarantiesFinancieres?: string;
  délaiÉchéanceGarantieBancaireEnMois?: number;
} & (
  | GarantiesFinancièresFamille
  | {
      soumisAuxGarantiesFinancieres?: undefined;
    }
);

// Demandes
type Changement = {
  informationEnregistrée?: boolean;
  demande?: boolean;
};

type ChangementAvecAutoritéCompétente =
  | {
      informationEnregistrée?: undefined;
      demande?: undefined;
      autoritéCompétente?: undefined;
    }
  | {
      informationEnregistrée?: undefined;
      demande: true;
      autoritéCompétente: AutoritéCompétente;
    };

type ChangementActionnaire = Changement & {
  informationEnregistréeEstSoumiseÀConditions?: true;
  modificationAdmin?: false;
};

type RatiosChangementPuissance =
  | { changementByTechnologie?: undefined; ratios: Ratios }
  | { changementByTechnologie: true; ratios: Record<Technologie, Ratios> };

type ChangementPuissance =
  | { demande?: undefined; informationEnregistrée?: undefined; paragrapheAlerte?: undefined }
  | ({
      demande: true;
      informationEnregistrée?: boolean;
      paragrapheAlerte?: string;
    } & RatiosChangementPuissance);

type ChangementReprésentantLégal =
  | {
      informationEnregistrée?: undefined;
      demande?: undefined;
      instructionAutomatique?: undefined;
    }
  | {
      informationEnregistrée: true;
      demande?: undefined;
      instructionAutomatique?: undefined;
    }
  | {
      informationEnregistrée?: undefined;
      demande: true;
      instructionAutomatique: 'accord' | 'rejet';
    };

type ChangementFournisseur = Changement & {
  modificationAdmin?: false;
};

export type RèglesDemandesChangement = {
  actionnaire: ChangementActionnaire;
  fournisseur: ChangementFournisseur;
  délai: ChangementAvecAutoritéCompétente;
  producteur: Changement;
  puissance: ChangementPuissance;
  représentantLégal: ChangementReprésentantLégal;
  recours: Changement;
  abandon: ChangementAvecAutoritéCompétente;
};

export type DomainesConcernésParChangement = keyof RèglesDemandesChangement;

// Courriers
export type DomainesCourriersRéponse = 'abandon' | 'actionnaire' | 'puissance' | 'délai';
export type DonnéesCourriersRéponse = {
  référenceParagraphe: string;
  dispositions: string;
};
export type DonnéesCourriersRéponseParDomaine = Record<
  | 'texteEngagementRéalisationEtModalitésAbandon'
  | 'texteChangementDActionnariat'
  | 'texteChangementDePuissance'
  | 'texteDélaisDAchèvement',
  DonnéesCourriersRéponse
>;

export type DélaiApplicable = {
  délaiEnMois: number;
  intervaleDateMiseEnService: { min: string; max: string };
};

export type CahierDesChargesModifié = {
  type: 'modifié';
  paruLe: DateParutionCahierDesChargesModifié;
  alternatif?: true;
  numéroGestionnaireRequis?: true;
  donnéesCourriersRéponse?: Partial<DonnéesCourriersRéponseParDomaine>;
  délaiApplicable?: DélaiApplicable;
  délaiAnnulationAbandon?: Date;
  changement?: Partial<RèglesDemandesChangement>;
};

// Technologies
export const technologies = ['pv', 'eolien', 'hydraulique'] as const;
export type Technologie = (typeof technologies)[number];
export type UnitéPuissance = 'MW' | 'MWc';

export type AutoritéCompétente = 'dreal' | 'dgec';

type TechnologieAppelOffre =
  | {
      technologie: Technologie;
      multiplesTechnologies?: undefined;
      /**
       * L'unité de puissance par défaut pour l'appel d'offre.
       * Cette valeur peut-être surchargée dans la période car dans certains cas, l'unité MW a été utilisée au lieu de MWc
       **/
      unitePuissance: UnitéPuissance;
      délaiRéalisationEnMois: number;
    }
  | {
      technologie?: undefined;
      multiplesTechnologies: true;
      /**
       * L'unité de puissance par défaut pour l'appel d'offre, en fonction de la technologie
       * Cette valeur peut-être surchargée dans la période car dans certains cas, l'unité MW a été utilisée au lieu de MWc
       **/
      unitePuissance: Record<Technologie, UnitéPuissance>;
      délaiRéalisationEnMois: Record<Technologie, number>;
    };

// Famille
export type GarantiesFinancièresFamille =
  | {
      soumisAuxGarantiesFinancieres: 'après candidature';
      garantieFinanciereEnMois: number;
    }
  | {
      soumisAuxGarantiesFinancieres: 'à la candidature' | 'non soumis';
    };

export type Famille = {
  id: string;
  title: string;
  puissanceMax?: number;
  garantiesFinancières: GarantiesFinancièresFamille;
};

type NoteThresholdByCategory = {
  volumeReserve: {
    noteThreshold: number;
    puissanceMax: number;
  };
  autres: {
    noteThreshold: number;
  };
};

export type Validateur = {
  nomComplet: string;
  fonction: string;
};

export type NotifiedPeriode = { type?: undefined } & (
  | {
      noteThresholdBy: 'category';
      noteThreshold: NoteThresholdByCategory;
    }
  | {
      noteThresholdBy?: undefined;
    }
) &
  CertificateTemplateProps;

/** Représente une période notifiée hors Potentiel */
type LegacyPeriode = {
  type: 'legacy';
  certificateTemplate?: undefined;
  noteThresholdBy?: undefined;
  noteThreshold?: undefined;
};

type CertificateTemplateProps =
  | {
      certificateTemplate: 'cre4.v0' | 'cre4.v1' | 'ppe2.v1';
    }
  | {
      certificateTemplate: 'ppe2.v2';
      logo: 'MEFSIN' | 'MCE' | 'Gouvernement';
    };

export type CertificateTemplate = CertificateTemplateProps['certificateTemplate'];

/**
 * Ces champs ne sont pas actifs pour tous les AOs/Périodes.
 * Pour les AOs qui les activent, ils peuvent être requis ou optionnels
 **/
const champsCandidature = [
  'puissanceALaPointe',
  /**
   * Active la possibilité pour le porteur de choisir ou non d'avoir un tarif indexé sur l'inflation.
   * Cette information est utilisée par le co-contractant.
   */
  'coefficientKChoisi',
  /**
   * puissance du projet (P) + autres installations sur le même site d'implantation (Q)
   * puissance de site = P + Q
   */
  'puissanceDeSite',
  'autorisationDUrbanisme',
  'installateur',
  'dispositifDeStockage',
  'natureDeLExploitation',
] as const;
export type ChampCandidature = (typeof champsCandidature)[number];

export type ChampsSupplémentairesCandidature = Partial<
  Record<ChampCandidature, 'requis' | 'optionnel'>
>;

export type Periode = {
  id: string;
  title: string;
  /** Surcharge l'unité de puissance par défaut définie dans l'AO, même si elle est définie par technologie */
  unitéPuissance?: UnitéPuissance;
  donnéesCourriersRéponse?: Partial<DonnéesCourriersRéponseParDomaine>;
  /**
   * Permet de modifier le paragraphe engagement IPFPGPFC, configuré dans l'AO
   * IPFPGPFC = Investissement Participatif/ Financement Partagé / Gouvernance Partagée / Finacement Collectif
   **/
  paragrapheEngagementIPFPGPFC?: string;
  cahierDesCharges: { référence: string };
  delaiDcrEnMois: {
    valeur: number;
    texte: string;
  };
  cahiersDesChargesModifiésDisponibles: ReadonlyArray<CahierDesChargesModifié>;
  abandonAvecRecandidature?: true;
  familles: Array<Famille>;
  /**
   * "indisponible" indique que les projets de la période ne peuvent pas faire de modification dans Potentiel sans choisir un CDC modificatif.
   **/
  changement?: Partial<RèglesDemandesChangement> | 'indisponible';
  addendums?: {
    /**
     * Permet un ajout personalisé dans le paragraphe Prix.
     */
    paragraphePrix?: string;
    /**
     * Permet un ajout personalisé dans le paragraphe Évaluation Carbone.
     * nécessite que affichageParagrapheECS soit true dans l'appel d'offre
     */
    paragrapheECS?: string;
  };
  champsSupplémentaires?: ChampsSupplémentairesCandidature;
} & (NotifiedPeriode | LegacyPeriode);

// Territoire
export const territoires = [
  'Corse',
  'Guadeloupe',
  'Guyane',
  'La Réunion',
  'Mayotte',
  'Martinique',
] as const;
export type Territoire = (typeof territoires)[number];

// Appel Offre Read Model
export type AppelOffreReadModel = {
  id: string;
  typeAppelOffre: AppelOffreTypes;
  cycleAppelOffre: 'CRE4' | 'PPE2';
  title: string;
  shortTitle: string;
  launchDate: string;
  cahiersDesChargesUrl: string;
  delaiRealisationTexte: string;
  paragraphePrixReference: string;
  paragrapheDelaiDerogatoire: string;
  paragrapheAttestationConformite: string;
  paragrapheEngagementIPFPGPFC: string;
  afficherParagrapheInstallationMiseEnServiceModification: boolean;
  renvoiModification: string;
  affichageParagrapheECS: boolean;
  renvoiDemandeCompleteRaccordement: string;
  renvoiEngagementIPFPGPFC: string;
  paragrapheClauseCompetitivite: string;
  tarifOuPrimeRetenue: string;
  tarifOuPrimeRetenueAlt: string;
  afficherValeurEvaluationCarbone: boolean;
  afficherPhraseRegionImplantation: boolean;
  dossierSuiviPar: EmailDGEC;
  periodes: Periode[];
  changementProducteurPossibleAvantAchèvement: boolean;
  dépôtDCRPossibleSeulementAprèsDésignation?: true;
  donnéesCourriersRéponse: Partial<DonnéesCourriersRéponseParDomaine>;
  doitPouvoirChoisirCDCInitial?: true;
  addendums?: {
    paragrapheRenseignerRaccordementDansPotentiel?: string;
    paragrapheRenseignerAttestationConformitéDansPotentiel?: string;
  };
  /**
   * "indisponible" indique que les projets de cet appel d'offre ne peuvent pas faire de modification dans Potentiel sans choisir un CDC modificatif.
   **/
  changement: RèglesDemandesChangement | 'indisponible';
  champsSupplémentaires?: ChampsSupplémentairesCandidature;
  garantiesFinancières: GarantiesFinancièresAppelOffre;
} & TechnologieAppelOffre;

export type AppelOffreEntity = Entity<'appel-offre', AppelOffreReadModel>;
