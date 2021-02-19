import { ProjectAppelOffre } from '../../../entities'

export type ProjectDataForProjectPage = {
  id: string

  appelOffre: ProjectAppelOffre

  appelOffreId: string
  periodeId: string
  familleId: string
  numeroCRE: string

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

  updatedAt?: Date
} & (IsNotified | IsNotNotified) &
  (IsClasse | IsElimine)

type IsNotNotified = {
  notifiedOn: undefined
}

type IsNotified = {
  notifiedOn: Date
  certificateFile?: {
    id: string
    filename: string
  }
} & Users &
  Invitations

type IsClasse = {
  isClasse: true
} & GarantieFinanciere &
  DCR &
  PTF

type IsElimine = {
  isClasse: false
  motifsElimination: string
}

type DCR = DCRSubmitted | DCRPending

type DCRSubmitted = {
  dcrDueOn: Date
  dcrSubmittedOn: Date
  dcrDate: Date
  dcrFile: {
    id: string
    filename: string
  }
  dcrNumeroDossier: string
}

type DCRPending = {
  dcrDueOn: Date
  dcrSubmittedOn: undefined
}

type PTF = PTFSubmitted | PTFPending

type PTFSubmitted = {
  ptfSubmittedOn: Date
  ptfDate: Date
  ptfFile: {
    id: string
    filename: string
  }
}

type PTFPending = {
  ptfSubmittedOn: undefined
}

type GarantieFinanciere = RequiresGF | DoesNotRequireGF

type DoesNotRequireGF = {
  garantiesFinancieresDueOn: undefined
}

type RequiresGF = {
  garantiesFinancieresDueOn: Date
} & (GFSubmitted | GFPending)

type GFSubmitted = {
  garantiesFinancieresSubmittedOn: Date
  garantiesFinancieresDate: Date
  garantiesFinancieresFile: {
    id: string
    filename: string
  }
}

type GFPending = {
  garantiesFinancieresSubmittedOn: undefined
}

type Users = {
  users: Array<{
    id: string
    fullName: string
    email: string
  }>
}

type Invitations = {
  invitations: Array<{
    id: string
    email: string
  }>
}
