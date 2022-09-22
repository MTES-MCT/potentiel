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

export type DonnéesCourriersRéponse = Record<
  | 'texteEngagementRéalisationEtModalitésAbandon'
  | 'texteChangementDActionnariat'
  | 'texteChangementDePuissance'
  | 'texteIdentitéDuProducteur'
  | 'texteChangementDeProducteur'
  | 'texteDélaisDAchèvement',
  {
    référenceParagraphe: string
    dispositions: string
  }
>

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
  renvoiSoumisAuxGarantiesFinancieres?: string
  changementPuissance: ChangementPuissance
  cahiersDesChargesModifiésDisponibles: ReadonlyArray<CahierDesChargesModifié>
  donnéesCourriersRéponse: Partial<DonnéesCourriersRéponse>
} & DelaiRealisation &
  GarantiesFinancièresAppelOffre

export type ProjectAppelOffre = AppelOffre & {
  periode: Periode
  famille: Famille | undefined
  isSoumisAuxGF: boolean
}
