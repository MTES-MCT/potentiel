import { Entity } from '@potentiel-domain/entity';

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

type ChangementPuissance = { paragrapheAlerte?: string } & (
  | {
      changementByTechnologie?: undefined;
      ratios: Ratios;
    }
  | {
      changementByTechnologie: true;
      ratios: { [key in Exclude<Technologie, 'N/A'>]: Ratios };
    }
);

type DelaiRealisation =
  | {
      delaiRealisationEnMois: number;
      decoupageParTechnologie: false;
    }
  | {
      delaiRealisationEnMoisParTechnologie: {
        [key in Exclude<Technologie, 'N/A'>]: number;
      };
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

export const cahiersDesChargesRéférences = [
  'initial',
  '30/07/2021',
  '30/08/2022',
  '30/08/2022-alternatif',
  '07/02/2023',
  '07/02/2023-alternatif',
] as const;

export type CahierDesChargesRéférence = (typeof cahiersDesChargesRéférences)[number];

const datesParutionCahiersDesChargesModifiés = ['30/07/2021', '30/08/2022', '07/02/2023'] as const;

export type DateParutionCahierDesChargesModifié =
  (typeof datesParutionCahiersDesChargesModifiés)[number];

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
export const technologies = ['pv', 'eolien', 'hydraulique', 'N/A'] as const;
export type Technologie = (typeof technologies)[number];

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

// Periode
type NoteThresholdByFamily = {
  familleId: string;
  noteThreshold: number;
  territoire?: Territoire;
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

export type NotifiedPeriode = {
  type?: 'notified';
} & (
  | {
      noteThresholdBy: 'family';
      noteThreshold: NoteThresholdByFamily[];
    }
  | {
      noteThresholdBy: 'category';
      noteThreshold: NoteThresholdByCategory;
    }
  | {
      noteThresholdBy?: undefined;
      noteThreshold: number;
    }
) &
  CertificateTemplateProps;

type NotYetNotifiedPeriode = {
  type: 'not-yet-notified';
  noteThresholdBy?: undefined;
  noteThreshold?: undefined;
} & CertificateTemplateProps;

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

export type Periode = {
  id: string;
  title: string;
  donnéesCourriersRéponse?: Partial<DonnéesCourriersRéponse>;
  cahierDesCharges: CahierDesCharges;
  delaiDcrEnMois: {
    valeur: number;
    texte: string;
  };
  dossierSuiviPar?: string;
  garantieFinanciereEnMoisSansAutorisationEnvironnementale?: number;
  cahiersDesChargesModifiésDisponibles: ReadonlyArray<CahierDesChargesModifié>;
  abandonAvecRecandidature?: true;
  choisirNouveauCahierDesCharges?: true;
  familles: Array<Famille>;
  changement: {
    représentantLégal: {
      typeTâchePlanifiée: 'accord-automatique' | 'rejet-automatique';
    };
  };
} & (NotifiedPeriode | NotYetNotifiedPeriode | LegacyPeriode);

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
  unitePuissance: string;
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
  dossierSuiviPar: string;
  periodes: Periode[];
  renvoiSoumisAuxGarantiesFinancieres?: string;
  changementPuissance: ChangementPuissance;
  changementProducteurPossibleAvantAchèvement: boolean;
  donnéesCourriersRéponse: Partial<DonnéesCourriersRéponse>;
  doitPouvoirChoisirCDCInitial?: true;
  autoritéCompétenteDemandesDélai: 'dgec' | 'dreal';
} & DelaiRealisation &
  GarantiesFinancièresAppelOffre;

export type AppelOffreEntity = Entity<'appel-offre', AppelOffreReadModel>;
