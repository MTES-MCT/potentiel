import { Project, AppelOffre, Periode, Famille, User, DREAL } from '../entities'
import {
  ProjectRepo,
  UserRepo,
  ProjectFilters,
  ContextSpecificProjectListFilter,
} from '../dataAccess'
import { Pagination, PaginatedList } from '../types'
import _ from 'lodash'

interface MakeUseCaseProps {
  searchForRegions: ProjectRepo['searchForRegions']
  findAllForRegions: ProjectRepo['findAllForRegions']
  searchForUser: ProjectRepo['searchForUser']
  findAllForUser: ProjectRepo['findAllForUser']
  searchAll: ProjectRepo['searchAll']
  findAll: ProjectRepo['findAll']
  findExistingAppelsOffres: ProjectRepo['findExistingAppelsOffres']
  findExistingPeriodesForAppelOffre: ProjectRepo['findExistingPeriodesForAppelOffre']
  findExistingFamillesForAppelOffre: ProjectRepo['findExistingFamillesForAppelOffre']
  findDrealsForUser: UserRepo['findDrealsForUser']
}

interface CallUseCaseProps {
  user: User
  appelOffreId?: AppelOffre['id']
  periodeId?: Periode['id']
  familleId?: Famille['id']
  pagination?: Pagination
  recherche?: string
  classement?: 'classés' | 'éliminés'
  garantiesFinancieres?: 'submitted' | 'notSubmitted'
}

interface UseCaseReturnType {
  projects: PaginatedList<Project>
  existingAppelsOffres: Array<AppelOffre['id']>
  existingPeriodes?: Array<Periode['id']>
  existingFamilles?: Array<Famille['id']>
}

export default function makeListProjects({
  searchForRegions,
  findAllForRegions,
  searchForUser,
  findAllForUser,
  searchAll,
  findAll,
  findExistingAppelsOffres,
  findExistingPeriodesForAppelOffre,
  findExistingFamillesForAppelOffre,
  findDrealsForUser,
}: MakeUseCaseProps) {
  return async function listProjects({
    user,
    appelOffreId,
    periodeId,
    familleId,
    pagination,
    recherche,
    classement,
    garantiesFinancieres,
  }: CallUseCaseProps): Promise<UseCaseReturnType> {
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

    if (classement) {
      query.isClasse = classement === 'classés'
    }

    if (garantiesFinancieres) {
      query.hasGarantiesFinancieres = garantiesFinancieres === 'submitted'
    }

    const result: any = {}

    let userSpecificProjectListFilter: ContextSpecificProjectListFilter

    switch (user.role) {
      case 'dreal':
        const regions = await findDrealsForUser(user.id)
        result.projects =
          recherche && recherche.length
            ? await searchForRegions(regions, recherche, query, pagination)
            : await findAllForRegions(regions, query, pagination)

        userSpecificProjectListFilter = {
          regions,
        }
        break
      case 'porteur-projet':
        result.projects =
          recherche && recherche.length
            ? await searchForUser(user.id, recherche, query, pagination)
            : await findAllForUser(user.id, query, pagination)

        userSpecificProjectListFilter = {
          userId: user.id,
        }
        break
      case 'admin':
      case 'dgec':
        result.projects =
          recherche && recherche.length
            ? await searchAll(recherche, query, pagination)
            : await findAll(query, pagination)

        userSpecificProjectListFilter = {
          isNotified: true,
        }
    }

    result.existingAppelsOffres = await findExistingAppelsOffres(
      userSpecificProjectListFilter
    )

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

    return result as UseCaseReturnType
  }
}
