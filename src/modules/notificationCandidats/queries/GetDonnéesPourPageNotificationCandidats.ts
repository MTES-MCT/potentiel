import { Project } from '@entities/project'
import { ProjectListItem } from '@modules/project/queries'
import { PaginatedList, Pagination } from '../../../types'

export type GetDonnéesPourPageNotificationCandidats = (args: {
  pagination: Pagination
  appelOffreId?: Project['appelOffreId']
  periodeId?: Project['periodeId']
  recherche?: string
  classement?: 'classés' | 'éliminés'
}) => Promise<{
  listeAOs: Project['appelOffreId'][]
  AOSélectionné: Project['appelOffreId']
  listePériodes: Project['periodeId'][]
  périodeSélectionnée: Project['periodeId']
  projetsPériodeSélectionnée: PaginatedList<ProjectListItem>
} | null>
