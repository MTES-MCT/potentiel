import { Periode } from './periode'
import { Famille } from './famille'

export type Technologie = 'pv' | 'eolien' | 'hydraulique'

type AutoAcceptRatios = {
  min: number
  max: number
}

type ChangementPuissance =
  | {
      changementByTechnologie?: undefined
      autoAcceptRatios: AutoAcceptRatios
    }
  | {
      changementByTechnologie: true
      autoAcceptRatios: { [key in Technologie]: AutoAcceptRatios }
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
      delaiRealisationEnMoisParTechnologie: { [key in Technologie]: number }
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
  renvoiSoumisAuxGarantiesFinancieres?: string
  periodes: Periode[]
  familles: Famille[]
  contenuParagrapheAchevement: string
  changementPuissance: ChangementPuissance
} & DelaiRealisation

export type ProjectAppelOffre = AppelOffre & {
  periode: Periode
  famille: Famille | undefined
  isSoumisAuxGFs: boolean
}
