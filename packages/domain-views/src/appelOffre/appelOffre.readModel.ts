import { ReadModel } from '@potentiel/core-domain';
import { RawIdentifiantAppelOffre } from '@potentiel/domain';

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

type ChangementPuissance =
  | {
      changementByTechnologie?: undefined;
      ratios: Ratios;
    }
  | {
      changementByTechnologie: true;
      ratios: { [key in Exclude<Technologie, 'N/A'>]: Ratios };
    };

type DelaiRealisation =
  | {
      delaiRealisationEnMois: number;
      decoupageParTechnologie: false;
    }
  | {
      delaiRealisationEnMoisParTechnologie: { [key in Exclude<Technologie, 'N/A'>]: number };
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
  url: string;
};

export type DélaiApplicable = {
  délaiEnMois: number;
  intervaleDateMiseEnService: { min: Date; max: Date };
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
  url: string;
  paruLe: DateParutionCahierDesChargesModifié;
  alternatif?: true;
  numéroGestionnaireRequis?: true;
  donnéesCourriersRéponse?: Partial<DonnéesCourriersRéponse>;
  délaiApplicable?: DélaiApplicable;
  délaiAnnulationAbandon?: Date;
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

export type NotifiedPeriode = {
  type?: 'notified';
  certificateTemplate: CertificateTemplate;
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
);

type NotYetNotifiedPeriode = {
  type: 'not-yet-notified';
  certificateTemplate: CertificateTemplate;
  noteThresholdBy?: undefined;
  noteThreshold?: undefined;
};

type LegacyPeriode = {
  type: 'legacy';
  certificateTemplate?: undefined;
  noteThresholdBy?: undefined;
  noteThreshold?: undefined;
};

export type CertificateTemplate = 'cre4.v0' | 'cre4.v1' | 'ppe2.v1' | 'ppe2.v2';

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
  cahiersDesChargesModifiésDisponibles?: ReadonlyArray<CahierDesChargesModifié>;
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
export type AppelOffre = {
  id: string;
  typeAppelOffre: AppelOffreTypes;
  title: string;
  shortTitle: string;
  launchDate: string;
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
  choisirNouveauCahierDesCharges?: true;
  periodes: Periode[];
  familles: Famille[];
  renvoiSoumisAuxGarantiesFinancieres?: string;
  changementPuissance: ChangementPuissance;
  changementProducteurPossibleAvantAchèvement: boolean;
  cahiersDesChargesModifiésDisponibles: ReadonlyArray<CahierDesChargesModifié>;
  donnéesCourriersRéponse: Partial<DonnéesCourriersRéponse>;
  doitPouvoirChoisirCDCInitial?: true;
  autoritéCompétenteDemandesDélai: 'dgec' | 'dreal';
} & DelaiRealisation &
  GarantiesFinancièresAppelOffre;

export type AppelOffreReadModelKey = `appel-offre|${RawIdentifiantAppelOffre}`;

export type AppelOffreReadModel = ReadModel<'appel-offre', AppelOffre>;
