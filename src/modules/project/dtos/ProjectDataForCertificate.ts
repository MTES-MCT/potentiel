import { ProjectAppelOffre } from '@entities'
import { ProjectDataProps } from '..'

export type ProjectDataForCertificate = {
  appelOffre: ProjectAppelOffre
  isClasse: boolean
  familleId: string | undefined
  prixReference: number
  evaluationCarbone: number
  isFinancementParticipatif: boolean
  isInvestissementParticipatif: boolean
  engagementFournitureDePuissanceAlaPointe: boolean
  motifsElimination: string
  note: number
  notifiedOn: number
  nomRepresentantLegal: string
  nomCandidat: string
  email: string
  nomProjet: string
  adresseProjet: string
  codePostalProjet: string
  communeProjet: string
  puissance: number
  potentielId: string
  territoireProjet: string
  technologie?: string
  actionnariat?: 'financement-collectif' | 'gouvernance-partagee'
}
