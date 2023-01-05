import { Project, AppelOffre, Periode, Famille, User } from '@entities'
import { ProjectRepo, UserRepo, ProjectFilters } from '@dataAccess'
import { Pagination, PaginatedList } from '../../../types'

type Dépendances = {
  searchForRegions: ProjectRepo['searchForRegions']
  findAllForRegions: ProjectRepo['findAllForRegions']
  searchForUser: ProjectRepo['searchForUser']
  findAllForUser: ProjectRepo['findAllForUser']
  searchAll: ProjectRepo['searchAll']
  findAll: ProjectRepo['findAll']
  findDrealsForUser: UserRepo['findDrealsForUser']
}

type Filtres = {
  user: User
  appelOffreId?: AppelOffre['id']
  periodeId?: Periode['id']
  familleId?: Famille['id']
  pagination?: Pagination
  recherche?: string
  classement?: 'classés' | 'éliminés' | 'abandons'
  reclames?: 'réclamés' | 'non-réclamés'
  garantiesFinancieres?: 'submitted' | 'notSubmitted' | 'pastDue'
}

export const PermissionListerProjets = {
  nom: 'lister-projets',
  description: 'Lister les projets',
}

export const makeListProjects = ({
  searchForRegions,
  findAllForRegions,
  searchForUser,
  findAllForUser,
  searchAll,
  findAll,
  findDrealsForUser,
}: Dépendances) => {
  return async function listProjects({
    user,
    appelOffreId,
    periodeId,
    familleId,
    pagination,
    recherche,
    classement,
    reclames,
    garantiesFinancieres,
  }: Filtres): Promise<PaginatedList<Project>> {
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

    switch (classement) {
      case 'classés':
        query.isClasse = true
        query.isAbandoned = false
        break
      case 'éliminés':
        query.isClasse = false
        query.isAbandoned = false
        break
      case 'abandons':
        query.isAbandoned = true
        break
    }

    if (reclames) {
      query.isClaimed = reclames === 'réclamés'
    }

    if (garantiesFinancieres) {
      query.garantiesFinancieres = garantiesFinancieres
    }

    switch (user.role) {
      case 'dreal':
        const regions = await findDrealsForUser(user.id)
        return recherche && recherche.length
          ? await searchForRegions(regions, recherche, query, pagination)
          : await findAllForRegions(regions, query, pagination)
      case 'porteur-projet':
        return recherche && recherche.length
          ? await searchForUser(user.id, recherche, query, pagination)
          : await findAllForUser(user.id, query, pagination)
      case 'admin':
      case 'dgec-validateur':
      case 'acheteur-obligé':
      case 'ademe':
      case 'cre':
      case 'caisse-des-dépôts':
        return recherche && recherche.length
          ? await searchAll(recherche, query, pagination)
          : await findAll(query, pagination)
    }
  }
}
