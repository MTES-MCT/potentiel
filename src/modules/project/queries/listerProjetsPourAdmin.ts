import { Project, AppelOffre, Periode, Famille, User } from '@entities'
import { ProjectRepo, ProjectFilters } from '@dataAccess'
import { Pagination, PaginatedList } from '../../../types'

type Dépendances = {
  searchAll: ProjectRepo['searchAll']
  findAll: ProjectRepo['findAll']
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

export const makeListerProjetsPourAdmin =
  ({ searchAll, findAll }: Dépendances) =>
  async ({
    appelOffreId,
    periodeId,
    familleId,
    pagination,
    recherche,
    classement,
    reclames,
    garantiesFinancieres,
  }: Filtres): Promise<PaginatedList<Project>> => {
    const filtres: ProjectFilters = {
      isNotified: true,
    }

    if (appelOffreId) {
      filtres.appelOffreId = appelOffreId

      if (periodeId) {
        filtres.periodeId = periodeId
      }

      if (familleId) {
        filtres.familleId = familleId
      }
    }

    switch (classement) {
      case 'classés':
        filtres.isClasse = true
        filtres.isAbandoned = false
        break
      case 'éliminés':
        filtres.isClasse = false
        filtres.isAbandoned = false
        break
      case 'abandons':
        filtres.isAbandoned = true
        break
    }

    if (reclames) {
      filtres.isClaimed = reclames === 'réclamés'
    }

    if (garantiesFinancieres) {
      filtres.garantiesFinancieres = garantiesFinancieres
    }

    return recherche && recherche.length
      ? await searchAll(recherche, filtres, pagination)
      : await findAll(filtres, pagination)
  }
