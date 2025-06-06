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

type Ratios = {
  min: number;
  max: number;
};

const emailsDGEC = [
  'aoeolien@developpement-durable.gouv.fr',
  'aopv.dgec@developpement-durable.gouv.fr',
] as const;
type EmailDGEC = (typeof emailsDGEC)[number];

type ChangementPuissance = { paragrapheAlerte?: string } & (
  | {
      changementByTechnologie?: undefined;
      ratios: Ratios;
    }
  | {
      changementByTechnologie: true;
      ratios: Record<Technologie, Ratios>;
    }
);

type DelaiRealisation =
  | {
      delaiRealisationEnMois: number;
      decoupageParTechnologie: false;
    }
  | {
      delaiRealisationEnMoisParTechnologie: Record<Technologie, number>;
      decoupageParTechnologie: true;
    };

// GF AO
type GarantiesFinancièresAppelOffre =
  | GarantiesFinancièresFamille
  | {
      soumisAuxGarantiesFinancieres?: undefined;
    };

// Courriers
export type DonnéesCourriersRéponse = Record<
  | 'texteEngagementRéalisationEtModalitésAbandon'
  | 'texteChangementDActionnariat'
  | 'texteChangementDePuissance'
  | 'texteIdentitéDuProducteur'
  | 'texteChangementDeProducteur'
  | 'texteDélaisDAchèvement',
  {
    référenceParagraphe: string;
    dispositions: string;
  }
>;

// Cahier des charges
export type CahierDesCharges = {
  référence: string;
};

export type DélaiApplicable = {
  délaiEnMois: number;
  intervaleDateMiseEnService: { min: string; max: string };
};

export type CahierDesChargesModifié = {
  type: 'modifié';
  paruLe: DateParutionCahierDesChargesModifié;
  alternatif?: true;
  numéroGestionnaireRequis?: true;
  donnéesCourriersRéponse?: Partial<DonnéesCourriersRéponse>;
  délaiApplicable?: DélaiApplicable;
  délaiAnnulationAbandon?: Date;
  seuilSupplémentaireChangementPuissance?: ChangementPuissance;
};

// Technologies
export const technologies = ['pv', 'eolien', 'hydraulique'] as const;
export type Technologie = (typeof technologies)[number];
export type UnitéPuissance = 'MW' | 'MWc';

type TechnologieAppelOffre =
  | {
      technologie: Technologie;
      multiplesTechnologies?: undefined;
      /**
       * L'unité de puissance par défaut pour l'appel d'offre.
       * Cette valeur peut-être surchargée dans la période car dans certains cas, l'unité MW a été utilisée au lieu de MWc
       **/
      unitePuissance: UnitéPuissance;
    }
  | {
      technologie?: undefined;
      multiplesTechnologies: true;
      /** @deprecated ce champs doit passer en Record<Technologie, UnitéPuissance> afin de représenter l'unité par technologie */
      unitePuissance: UnitéPuissance;
      /**
       * L'unité de puissance par défaut pour l'appel d'offre, en fonction de la technologie
       * Cette valeur peut-être surchargée dans la période car dans certains cas, l'unité MW a été utilisée au lieu de MWc
       **/
      // unitePuissance: Record<Technologie, UnitéPuissance>;
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
} & GarantiesFinancièresFamille;

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

export type NotifiedPeriode = (
  | {
      noteThresholdBy: 'category';
      noteThreshold: NoteThresholdByCategory;
    }
  | {
      noteThresholdBy?: undefined;
    }
) &
  CertificateTemplateProps;

type LegacyPeriode = {
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

export type Periode = {
  id: string;
  type?: 'legacy';
  title: string;
  donnéesCourriersRéponse?: Partial<DonnéesCourriersRéponse>;
  /**
   * Permet de modifier le paragraphe engagement IPFPGPFC, configuré dans l'AO
   * IPFPGPFC = Investissement Participatif/ Financement Partagé / Gouvernance Partagée / Finacement Collectif
   **/
  paragrapheEngagementIPFPGPFC?: string;
  cahierDesCharges: CahierDesCharges;
  delaiDcrEnMois: {
    valeur: number;
    texte: string;
  };
  garantieFinanciereEnMoisSansAutorisationEnvironnementale?: number;
  cahiersDesChargesModifiésDisponibles: ReadonlyArray<CahierDesChargesModifié>;
  abandonAvecRecandidature?: true;
  /** les projets de la période ne peuvent pas faire de modification sans choisir un CDC modificatif */
  choisirNouveauCahierDesCharges?: true;
  familles: Array<Famille>;
  changement: {
    représentantLégal: {
      typeTâchePlanifiée: 'accord-automatique' | 'rejet-automatique';
    };
  };
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
  /**
   * Active la possibilité pour le porteur de choisir ou non d'avoir un tarif indexé sur l'inflation.
   * Cette information est utilisée par le co-contractant.
   */
  choixCoefficientKDisponible?: true;
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
  renvoiRetraitDesignationGarantieFinancieres: string;
  renvoiEngagementIPFPGPFC: string;
  paragrapheClauseCompetitivite: string;
  tarifOuPrimeRetenue: string;
  tarifOuPrimeRetenueAlt: string;
  afficherValeurEvaluationCarbone: boolean;
  afficherPhraseRegionImplantation: boolean;
  dossierSuiviPar: EmailDGEC;
  periodes: Periode[];
  renvoiSoumisAuxGarantiesFinancieres?: string;
  changementPuissance: ChangementPuissance;
  changementProducteurPossibleAvantAchèvement: boolean;
  donnéesCourriersRéponse: Partial<DonnéesCourriersRéponse>;
  doitPouvoirChoisirCDCInitial?: true;
  autoritéCompétenteDemandesDélai: 'dgec' | 'dreal';
  /** Indique que le champs booléen "puissanceALaPointe" est disponible pour cet AO */
  puissanceALaPointeDisponible?: true;
} & DelaiRealisation &
  GarantiesFinancièresAppelOffre &
  TechnologieAppelOffre;

export type AppelOffreEntity = Entity<'appel-offre', AppelOffreReadModel>;
