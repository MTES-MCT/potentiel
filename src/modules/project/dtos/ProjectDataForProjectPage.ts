import { ProjectAppelOffre } from '@entities'

export type ProjectDataForProjectPage = {
  id: string
  potentielIdentifier: string

  appelOffre: ProjectAppelOffre

  appelOffreId: string
  periodeId: string
  familleId: string
  numeroCRE: string
  cahierDesChargesActuel: {
    url: string
  } & (
    | {
        type: 'initial'
      }
    | {
        type: 'modifié'
        paruLe: string
        alternatif?: true
      }
  )

  isLegacy: boolean

  puissance: number
  prixReference?: number

  engagementFournitureDePuissanceAlaPointe: boolean
  isFinancementParticipatif: boolean
  isInvestissementParticipatif: boolean

  adresseProjet: string
  codePostalProjet: string
  communeProjet: string
  departementProjet: string
  regionProjet: string
  territoireProjet?: string

  nomCandidat: string
  nomProjet: string
  nomRepresentantLegal: string
  email: string
  fournisseur: string
  evaluationCarbone: number
  note: number

  details: Record<string, any>

  contratEDF?: Partial<{
    numero: string
    type: string
    dateEffet: string
    dateSignature: string
    dateMiseEnService: string
    duree: number
    statut: string
  }>

  contratEnedis?: {
    numero: string
  }

  updatedAt?: Date
} & (IsNotified | IsNotNotified) &
  (IsClasse | IsElimine | IsAbandoned)

type IsNotNotified = {
  notifiedOn: undefined
}

type IsNotified = {
  notifiedOn: Date
  certificateFile?: {
    id: string
    filename: string
  }
} & Users

type IsClasse = {
  isClasse: true
  isAbandoned: false
  completionDueOn: Date
} & GarantieFinanciere &
  PTF

type IsElimine = {
  isClasse: false
  isAbandoned: false
  motifsElimination: string
}

type IsAbandoned = {
  isAbandoned: true
  isClasse: false
}

type PTF = PTFSubmitted | PTFPending

type PTFSubmitted = {
  ptf: {
    submittedOn: Date
    ptfDate: Date
    file: {
      id: string
      filename: string
    }
  }
}

type PTFPending = {
  ptf: undefined
}

type GarantieFinanciere = RequiresGF | DoesNotRequireGF

type DoesNotRequireGF = {
  garantiesFinancieres: undefined
}

type RequiresGF = {
  garantiesFinancieres: {
    dueOn: Date
  } & (GFSubmitted | GFPending)
}

type GFSubmitted = {
  submittedOn: Date
  gfDate: Date
  file: {
    id: string
    filename: string
  }
  gfStatus: string
}

type GFPending = {
  submittedOn: undefined
}

type Users = {
  users: Array<{
    id: string
    fullName: string
    email: string
  }>
}
