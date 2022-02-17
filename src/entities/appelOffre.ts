import { Periode } from './periode'
import { Famille } from './famille'

type ChangementPuissance = {
  autoAcceptRatios: {
    min: number
    max: number
  }
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
      delaiRealisationEnMoisParTechnologie: {
        pv: number
        eolien: number
        hydraulique: number
      }
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
