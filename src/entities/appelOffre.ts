import { Periode } from './periode'
import { Famille, GarantiesFinancièresFamille } from './famille'
import { CahierDesChargesModifié } from './cahierDesCharges'

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

type GarantiesFinancièresAppelOffre =
  | GarantiesFinancièresFamille
  | {
      soumisAuxGarantiesFinancieres?: undefined
    }

type RéférencesCourriersRéponseModifications = {
  engagementRéalisationEtModalitésAbandon: { référenceParagraphe: string; dispositions: string }
  changementDePuissance: { référenceParagraphe: string; dispositions: string }
  changementDActionnariat: { référenceParagraphe: string; dispositions: string }
  identitéDuProducteur: { référenceParagraphe: string; dispositions: string }
  changementDeProducteur: { référenceParReagraphe: string; dispositions: string }
  délaisDAchèvement: { référenceParagraphe: string; dispositions: string }
  prolongationDeDélai?: { dispositions: string } // à vérifier si on a besoin de cette donnée
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
  choisirNouveauCahierDesCharges?: true
  periodes: Periode[]
  familles: Famille[]
  contenuParagrapheAchevement?: string // a supprimer car deviendra appelOffre.DélaisDAchèvement.dispositions
  renvoiSoumisAuxGarantiesFinancieres?: string
  changementPuissance: ChangementPuissance
  cahiersDesChargesModifiésDisponibles: ReadonlyArray<CahierDesChargesModifié>
} & DelaiRealisation &
  GarantiesFinancièresAppelOffre &
  RéférencesCourriersRéponseModifications

export type ProjectAppelOffre = AppelOffre & {
  periode: Periode
  famille: Famille | undefined
  isSoumisAuxGF: boolean
}
