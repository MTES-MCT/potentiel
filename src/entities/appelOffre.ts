import { Periode } from './periode'
import { Famille } from './famille'

export type AppelOffre = {
  id: string
  title: string
  shortTitle: string
  launchDate: string
  unitePuissance: string
  delaiRealisationTexte: string
  paragraphePrixReference: string
  paragrapheDelaiDerogatoire: string
  paragrapheAttestationConformite: string
  paragrapheEngagementIPFP: string
  afficherParagrapheInstallationMiseEnServiceModification: boolean
  renvoiModification: string
  affichageParagrapheECS: boolean
  renvoiDemandeCompleteRaccordement: string
  renvoiRetraitDesignationGarantieFinancieres: string
  renvoiEngagementIPFP: string
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
} & (
  | { delaiRealisationEnMois: number; decoupageParTechnologie: false }
  | {
      delaiRealisationEnMoisParTechnologie: { pv: number; eolien: number; hydraulique: number }
      decoupageParTechnologie: true
    }
)

export type ProjectAppelOffre = AppelOffre & {
  periode: Periode
  famille: Famille | undefined
}
