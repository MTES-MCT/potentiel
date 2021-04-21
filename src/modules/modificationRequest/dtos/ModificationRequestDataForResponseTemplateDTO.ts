import { DREAL } from '../../../entities'
import { ModificationRequestStatusDTO } from './ModificationRequestListItemDTO'

export type ModificationRequestDateForResponseTemplateDTO = {
  suiviPar: string
  suiviParEmail: string
  refPotentiel: string

  dreal: DREAL | ''

  status: ModificationRequestStatusDTO

  nomRepresentantLegal: string
  nomCandidat: string
  adresseCandidat: string
  email: string

  titrePeriode: string
  titreAppelOffre: string
  familles: 'yes' | ''
  titreFamille: string

  nomProjet: string
  puissance: string
  codePostalProjet: string
  communeProjet: string
  unitePuissance: string

  dateDemande: string
  justificationDemande: string
} & (DelaiVariant | RecoursVariant | AbandonVariant | PuissanceVariant)

type DelaiVariant = {
  type: 'delai'
  referenceParagrapheAchevement: string
  contenuParagrapheAchevement: string
  dateLimiteAchevementInitiale: string
  dateLimiteAchevementActuelle: string
  dateNotification: string
  dureeDelaiDemandeEnMois: string
} & (
  | { demandePrecedente: '' }
  | {
      demandePrecedente: 'yes'
      dateDepotDemandePrecedente: string
      dureeDelaiDemandePrecedenteEnMois: string
      dateReponseDemandePrecedente: string
      autreDelaiDemandePrecedenteAccorde: 'yes' | ''
      delaiDemandePrecedenteAccordeEnMois: string
    }
)

type RecoursVariant = {
  type: 'recours'
  isFinancementParticipatif: 'yes' | ''
  isInvestissementParticipatif: 'yes' | ''
  isEngagementParticipatif: 'yes' | ''
  evaluationCarbone: string
  engagementFournitureDePuissanceAlaPointe: 'yes' | ''
  prixReference: string

  nonInstruit: 'yes' | ''
  motifsElimination: string

  tarifOuPrimeRetenue: string
  tarifOuPrimeRetenueAlt: string
  paragraphePrixReference: string
  affichageParagrapheECS: 'yes' | ''
  eolien: 'yes' | ''
  AOInnovation: 'yes' | ''
  soumisGF: 'yes' | ''
  renvoiSoumisAuxGarantiesFinancieres: string
  renvoiDemandeCompleteRaccordement: string
  renvoiRetraitDesignationGarantieFinancieres: string
  paragrapheDelaiDerogatoire: string
  paragrapheAttestationConformite: string
  paragrapheEngagementIPFP: string
  renvoiModification: string
  delaiRealisationTexte: string
}

type AbandonVariant = {
  type: 'abandon'

  dateNotification: string

  referenceParagrapheAbandon: string
  contenuParagrapheAbandon: string

  dateDemandeConfirmation: string
  dateConfirmation: string
}

type PuissanceVariant = {
  type: 'puissance'
}
