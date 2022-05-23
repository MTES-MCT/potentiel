import { Periode } from './periode'
import { Famille } from './famille'

export const technologies = ['pv', 'eolien', 'hydraulique', 'N/A'] as const
export type Technologie = typeof technologies[number]

type Ratios = {
  min: number
  max: number
}

type ChangementPuissance =
  | {
      changementByTechnologie?: undefined
      ratios: Ratios
    }
  | {
      changementByTechnologie: true
      ratios: { [key in Exclude<Technologie, 'N/A'>]: Ratios }
    }

type AppelOffreTypes =
  | 'autoconso'
  | 'batiment'
  | 'eolien'
  | 'innovation'
  | 'neutre'
  | 'sol'
  | 'zni'
  | 'autre'

type DelaiRealisation =
  | {
      delaiRealisationEnMois: number
      decoupageParTechnologie: false
    }
  | {
      delaiRealisationEnMoisParTechnologie: { [key in Exclude<Technologie, 'N/A'>]: number }
      decoupageParTechnologie: true
    }

export type AppelOffre = {
  id: string
  type: AppelOffreTypes
  title: string
  shortTitle: string
  launchDate: string
  unitePuissance: string
  delaiRealisationTexte: string
  paragraphePrixReference: string
  paragrapheDelaiDerogatoire: string
  paragrapheAttestationConformite: string
  paragrapheEngagementIPFPGPFC: string
  afficherParagrapheInstallationMiseEnServiceModification: boolean
  renvoiModification: string
  affichageParagrapheECS: boolean
  renvoiDemandeCompleteRaccordement: string
  renvoiRetraitDesignationGarantieFinancieres: string
  renvoiEngagementIPFPGPFC: string
  paragrapheClauseCompetitivite: string
  tarifOuPrimeRetenue: string
  tarifOuPrimeRetenueAlt: string
  afficherValeurEvaluationCarbone: boolean
  afficherPhraseRegionImplantation: boolean
  dossierSuiviPar: string
  soumisAuxGarantiesFinancieres?: boolean
  garantiesFinancieresDeposeesALaCandidature?: boolean
  renvoiSoumisAuxGarantiesFinancieres?: string
  periodes: Periode[]
  familles: Famille[]
  contenuParagrapheAchevement: string
  changementPuissance: ChangementPuissance
  delaiDcrEnMois: {
    valeur: number
    texte: string
  }
} & DelaiRealisation

export type ProjectAppelOffre = AppelOffre & {
  periode: Periode
  famille: Famille | undefined
  isSoumisAuxGFs: boolean
}
