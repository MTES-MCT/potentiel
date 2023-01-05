import { ProjectFilters } from '@dataAccess'
import { AppelOffre, Famille, Periode } from '@entities'
import { Pagination } from '../../../../../types'

export type FiltresConstruireQuery = {
  appelOffreId?: AppelOffre['id']
  periodeId?: Periode['id']
  familleId?: Famille['id']
  pagination?: Pagination
  recherche?: string
  classement?: 'classés' | 'éliminés' | 'abandons'
  reclames?: 'réclamés' | 'non-réclamés'
  garantiesFinancieres?: 'submitted' | 'notSubmitted' | 'pastDue'
}

export const construireQuery = (filtres: FiltresConstruireQuery) => {
  const query: ProjectFilters = {
    isNotified: true,
  }

  if (filtres.appelOffreId) {
    query.appelOffreId = filtres.appelOffreId

    if (filtres.periodeId) {
      query.periodeId = filtres.periodeId
    }

    if (filtres.familleId) {
      query.familleId = filtres.familleId
    }
  }

  switch (filtres.classement) {
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

  if (filtres.reclames) {
    query.isClaimed = filtres.reclames === 'réclamés'
  }

  if (filtres.garantiesFinancieres) {
    query.garantiesFinancieres = filtres.garantiesFinancieres
  }

  return query
}
