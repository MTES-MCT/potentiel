import { Région } from '@modules/dreal/région'
import { ModificationRequestStatusDTO } from './ModificationRequestListItemDTO'

export type ModificationRequestDataForResponseTemplateDTO = {
  suiviPar: string
  suiviParEmail: string
  refPotentiel: string

  dreal: Région | ''

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
} & (
  | DelaiVariant
  | RecoursVariant
  | AbandonVariant
  | PuissanceVariant
  | ActionnaireVariant
  | ProducteurVariant
  | AnnulationAbandonVariant
)

type DelaiVariant = {
  type: 'delai'
  referenceParagrapheAchevement: string
  contenuParagrapheAchevement: string
  dateLimiteAchevementInitiale: string
  dateLimiteAchevementActuelle: string
  dateAchèvementDemandée: string
  dateNotification: string
} & (
  | { demandePrecedente: '' }
  | ({
      demandePrecedente: 'yes'
      dateDepotDemandePrecedente: string
      dateReponseDemandePrecedente: string
      autreDelaiDemandePrecedenteAccorde: 'yes' | ''
    } & (
      | {
          demandeEnMois: 'yes'
          delaiDemandePrecedenteAccordeEnMois: string
          dureeDelaiDemandePrecedenteEnMois: string
        }
      | {
          demandeEnDate: 'yes'
          dateDemandePrecedenteAccordée: string
          dateDemandePrecedenteDemandée: string
        }
    ))
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
  paragrapheEngagementIPFPGPFC: string
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
  referenceParagraphePuissance: string
  contenuParagraphePuissance: string
}

type ActionnaireVariant = {
  type: 'actionnaire'
  nouvelActionnaire: string
  referenceParagrapheActionnaire: string
  contenuParagrapheActionnaire: string
}

type ProducteurVariant = {
  type: 'producteur'
  nouveauProducteur: string
  referenceParagrapheIdentiteProducteur: string
  contenuParagrapheIdentiteProducteur: string
  referenceParagrapheChangementProducteur: string
  contenuParagrapheChangementProducteur: string
}

type AnnulationAbandonVariant = {
  type: 'annulation abandon'
  dateNotification: string
  referenceParagrapheAbandon: string
  contenuParagrapheAbandon: string
  dateDemandeConfirmation: string
  dateConfirmation: string
}
