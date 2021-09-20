import { Project, AppelOffre, Periode, Famille, User } from '../entities'
import { ProjectRepo, ProjectFilters, ContextSpecificProjectListFilter } from '../dataAccess'
import { Pagination, PaginatedList } from '../types'

interface MakeUseCaseProps {
  searchAllMissingOwner: ProjectRepo['searchAllMissingOwner']
  findExistingAppelsOffres: ProjectRepo['findExistingAppelsOffres']
  findExistingPeriodesForAppelOffre: ProjectRepo['findExistingPeriodesForAppelOffre']
  findExistingFamillesForAppelOffre: ProjectRepo['findExistingFamillesForAppelOffre']
}

interface ListMissingOwnerProjectsDeps {
  user: User
  appelOffreId?: AppelOffre['id']
  periodeId?: Periode['id']
  familleId?: Famille['id']
  pagination?: Pagination
  recherche?: string
  classement?: 'classés' | 'éliminés' | 'abandons'
  garantiesFinancieres?: 'submitted' | 'notSubmitted' | 'pastDue'
}

interface ListMissingOwnerProjectsResult {
  projects: PaginatedList<Project>
  existingAppelsOffres: Array<AppelOffre['id']>
  existingPeriodes?: Array<Periode['id']>
  existingFamilles?: Array<Famille['id']>
}

export default function makeListMissingOwnerProjects({
  searchAllMissingOwner,
  findExistingAppelsOffres,
  findExistingPeriodesForAppelOffre,
  findExistingFamillesForAppelOffre,
}: MakeUseCaseProps) {
  return async function listMissingOwnerProjects({
    user,
    appelOffreId,
    periodeId,
    familleId,
    pagination,
    recherche,
  }: ListMissingOwnerProjectsDeps): Promise<ListMissingOwnerProjectsResult> {
    const query: ProjectFilters = {
      isNotified: true,
    }

    if (appelOffreId) {
      query.appelOffreId = appelOffreId

      if (periodeId) {
        query.periodeId = periodeId
      }

      if (familleId) {
        query.familleId = familleId
      }
    }

    const result: any = {}

    let userSpecificProjectListFilter: ContextSpecificProjectListFilter | undefined = undefined

    const projects = await searchAllMissingOwner(user.email, user.id, recherche, query, pagination)

    result.projects = projects

    userSpecificProjectListFilter = {
      userId: user.id,
    }

    result.existingAppelsOffres = await findExistingAppelsOffres(userSpecificProjectListFilter)

    if (appelOffreId && userSpecificProjectListFilter) {
      result.existingPeriodes = await findExistingPeriodesForAppelOffre(
        appelOffreId,
        userSpecificProjectListFilter
      )
      result.existingFamilles = await findExistingFamillesForAppelOffre(
        appelOffreId,
        userSpecificProjectListFilter
      )
    }

    return result as ListMissingOwnerProjectsResult
  }
}
