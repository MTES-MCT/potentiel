import { Periode } from './periode'
import { Famille } from './famille'

type DataField = {
  field: string
  column: string
  type:
    | 'string'
    | 'number'
    | 'date'
    | 'stringEquals' // column should equals value
    | 'orNumberInColumn' // if column is empty, check try column
    | 'orStringInColumn' // if column is empty, check try column
    | 'codePostal' // Special case where we want to extend departement / région from codePostal
  value?: string
  defaultValue?: unknown
}

export type AppelOffre = {
  id: string
  title: string
  shortTitle: string
  launchDate: string
  unitePuissance: string
  delaiRealisationEnMois: number
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
  renvoiSoumisAuxGarantiesFinancieres?: string
  periodes: Periode[]
  familles: Famille[]
  dataFields: DataField[]
  contenuParagrapheAchevement: string
}

export type ProjectAppelOffre = AppelOffre & {
  periode: Periode
  famille: Famille | undefined
}
