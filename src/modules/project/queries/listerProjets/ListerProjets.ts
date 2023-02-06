import { AppelOffre, Periode, Famille, ProjectAppelOffre, User } from '@entities'
import { PaginatedList, Pagination } from '../../../../types'

export const PermissionListerProjets = {
  nom: 'lister-projets',
  description: 'Lister les projets',
}

export type ProjectListItem = {
  id: string
  nomProjet: string
  potentielIdentifier: string
  communeProjet: string
  departementProjet: string
  regionProjet: string
  nomCandidat: string
  nomRepresentantLegal: string
  email: string
  puissance: number
  appelOffre?: {
    type: ProjectAppelOffre['type']
    unitePuissance: ProjectAppelOffre['unitePuissance']
    periode: ProjectAppelOffre['periode']
  }
  prixReference?: number
  evaluationCarbone?: number
  classe: 'Classé' | 'Eliminé'
  abandonedOn: number
  notifiedOn: number
  isFinancementParticipatif?: boolean
  isInvestissementParticipatif?: boolean
  actionnariat?: 'financement-collectif' | 'gouvernance-partagee' | ''
  garantiesFinancières?: {
    id: string
    dateEnvoi?: Date
    statut: 'en attente' | 'à traiter' | 'validé'
    fichier?: {
      id: string
      filename: string
    }
  }
}

export type FiltreListeProjets = {
  recherche?: string
  appelOffre?: {
    appelOffreId?: AppelOffre['id']
    periodeId?: Periode['id']
    familleId?: Famille['id']
  }
  classement?: 'classés' | 'éliminés' | 'abandons'
  reclames?: 'réclamés' | 'non-réclamés'
  garantiesFinancieres?: 'submitted' | 'notSubmitted' | 'pastDue'
  étatNotification?: 'notifiés' | 'non-notifiés'
}

export type ListerProjets = (args: {
  user: User
  pagination: Pagination
  filtres?: FiltreListeProjets
}) => Promise<PaginatedList<ProjectListItem>>
